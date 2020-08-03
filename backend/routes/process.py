import os
import cv2
from flask import Blueprint, request, jsonify, current_app as app
from flask_jwt_extended import jwt_required
from time import sleep
import numpy as np
import itertools
from bson import ObjectId
from utils.connect import db, fs
from utils.utils import getFrame, randomString, processor
from flask_executor import Executor
from datetime import datetime
import utils.classification as cf
import utils.colorize as cl
from utils.colorlist import colours
import json
import collections
import ast
from threading import Thread
import time

features_pack = {}

process = Blueprint('process', __name__)
executor = Executor()

all_colors = [color[3] for color in colours]
def rgb2hex(r, g, b): return f"#{r:02x}{g:02x}{b:02x}"



class RTSPVideoWriterObject(object):
    def __init__(self, src=0):
        # Create a VideoCapture object
        self.capture = cv2.VideoCapture(src)

        # Default resolutions of the frame are obtained (system dependent)
        self.frame_width = int(self.capture.get(3))
        self.frame_height = int(self.capture.get(4))

        # Set up codec and output video settings
        self.codec = cv2.VideoWriter_fourcc('M','J','P','G')
        self.output_video = cv2.VideoWriter('saves/output.avi', self.codec, 30, (self.frame_width, self.frame_height))

        # Start the thread to read frames from the video stream
        self.thread = Thread(target=self.update, args=())
        self.thread.daemon = True
        self.thread.start()

    def update(self):
        # Read the next frame from the stream in a different thread
        while True:
            if self.capture.isOpened():
                (self.status, self.frame) = self.capture.read()

    def show_frame(self):
        # Display frames in main program
        if self.status:
            cv2.imshow('frame', self.frame)

        # Press Q on keyboard to stop recording
        key = cv2.waitKey(1)
        if key == ord('q'):
            self.capture.release()
            self.output_video.release()
            cv2.destroyAllWindows()
            exit(1)

    def save_frame(self):
        # Save obtained frame into video output file
        self.output_video.write(self.frame)



'''------------------------------------------------
    breaking video down to frames and processing
--------------------------------------------------'''

@process.route('/streamvideo', methods=['POST'])
def streamVideo():
    data = json.loads(request.data)
    rtsp_stream_link = data.get("ip")
    location = data.get("location")
    timestamp = datetime.now()
    # print(rtsp_stream_link, location)
    # rtsp_stream_link = 'http://192.168.0.107:8080/video'
    
    video_stream_widget = RTSPVideoWriterObject(rtsp_stream_link)
    frame = 0
    while frame <= 1000:
        try:
            # video_stream_widget.show_frame()
            video_stream_widget.save_frame()
            frame +=1
        except AttributeError:
            pass
    
    tmz_str = ' GMT+0530 (India Standard Time)'
    if timestamp.endswith(tmz_str):
        timestamp = timestamp.replace(tmz_str, '')

    date_time_obj = None
    try:
        date_time_obj = datetime.strptime(timestamp, '%a %b %d %Y %H:%M:%S')
    except Exception as e:
        pass
    if date_time_obj == None:
        return jsonify({
            "success": False,
            "message": "Timestamp is invalid. Please try again!"
        }), 403

    oid = fs.upload_from_stream(filename, file)
    video_name = 'saves/' + randomString() + '.mp4'
    f = open(video_name, 'wb+')
    fs.download_to_stream(oid, f)
    f.close()
    try:
        metadata = getFirstFrame(video_name)
        thumbnail = metadata[0]
        duration = time.strftime("%H:%M:%S", time.gmtime(metadata[1]))
    except Exception as e:
        print(e)
        if os.path.exists(video_name):
            os.remove(video_name)
        return jsonify({"success": False, "message": "Failed to process video"}), 500

    thumbnail_oid = fs.upload_from_stream(str(oid), thumbnail)
    # To check if image is saved
    # f_img = open('saves/frame2.jpg','wb+')
    # fs.download_to_stream(thumbnail_oid, f_img)
    # f_img.close()

    # insert video details
    db.video.insert_one({
        "name": name,
        "date": str(date_time_obj.date()),
        "time": str(date_time_obj.time()),
        "location_id": location,
        "file_id": str(oid),
        "thumbnail_id": str(thumbnail_oid),
        "duration": duration,
        "processing": False,
        "prepared": False
    })

    if os.path.exists(video_name):
        os.remove(video_name)

    return jsonify({
        "success": True,
        "message": "Video successfully uploaded"
    }), 200


@process.route('/processvideo/<oid>', methods=['GET'])
@jwt_required
def processVideo(oid):
    print(oid)
    if oid == None or len(oid) != 24:
        return jsonify({"success": False, "message": "No Object Id in param."}), 400
    elif "video" not in db.list_collection_names():
        return jsonify({"success": False, "message": "No Collection video."}), 404
    else:
        video = db.video.find_one({"_id": ObjectId(oid)})
        if video['prepared'] == True:
            return jsonify({"success": False, "message": "Video is already processed."}), 404
        elif video['processing'] == True:
            return jsonify({"success": False, "message": "Video is currently being processed."}), 404
        else:
            # save timestamp info in the video collection
            date = video['date']
            time = video['time']
            timestamp = json.dumps(datetime.strptime(
                date+time, '%Y-%m-%d%H:%M:%S'), ensure_ascii=False, indent=4, default=str)
            file_id = video["file_id"]
            processor(oid, file_id, timestamp)
            executor.submit(processor)
            db.video.update({"_id": ObjectId(oid)}, {
                            "$set": {"processing": True}})
            return jsonify({"success": True, "message": "Video will be processed in a while!"}), 200


'''------------------------------------------------
            processing cropped images
--------------------------------------------------'''


@process.route('/processcropped', methods=['POST'])
@jwt_required
def processCroppedImages():
    uploaded_files = request.files.getlist("files")
    print(uploaded_files)
    features = []
    for file in uploaded_files:
        image_buffer = file.read()
        # convert string data to numpy array
        np_image = np.frombuffer(image_buffer, dtype=np.uint8)
        # convert numpy array to image
        image = cv2.imdecode(np_image, flags=1)

        labels = cf.classify(image)
        color_length = len(labels)

        if color_length != 0:  # if no labels are identified then dont check for color
            colors = cl.colorize(image, color_length)
            for color in colors:
                color_values = []
                r, g, b, name = colours[all_colors.index(color)]
                color_values.append({"hex": rgb2hex(r, g, b), "rgb": {
                    "r": r, "g": g, "b": b, "a": 1}})
            features.append({"labels": labels, "colors": color_values})

    return jsonify({"success": True, "features": features}), 200


'''------------------------------------------------
    Reciving video output in chunks from backend2
--------------------------------------------------'''


@process.route('/FindUnique', methods=['POST'])
def FindUnique():
    records = json.loads(request.data)
    video = db.video.find_one({"_id": ObjectId(records['video_id'])})
    cctv = db.cctv.find_one({"_id": ObjectId(video['location_id'])})
    print(records['unique_person'])
    if records['unique_person'] != []:
        for single_record in records['unique_person']:
            # not really sure abt the parameters
            single_record.update({'coord': {"latitude": cctv['latitude'], "longitude": cctv['longitude']}, 'location_type': cctv['location_type'], "street": cctv['street'],
                                  "city": cctv['city'], "county": cctv['county'], "country": cctv['country'], "state": cctv['state'], "sublocality": cctv['sublocality']})

        # saving unique_persons into db
        db.unique_person.insert_many(records['unique_person'])
        db.video.update({"_id": ObjectId(records['video_id'])}, {
                        "$set": {"prepared": True, "processing": False}})

    return jsonify({"success": True, "message": "Video is processed!"}), 200


'''------------------------------------------------
                for testing only
--------------------------------------------------'''

# '''


@process.route('/video', methods=['POST'])
def Video():
    path = "C:\\Users\\Lenovo\\Downloads\\Documents\\GitHub\\yolo_textiles\\videos\\airport.mp4"
    oid = "5f05d0f814e6a15bdc797d12"
    timestamp = json.dumps(
        datetime.now(), ensure_ascii=False, indent=4, default=str)

    vidcap = cv2.VideoCapture(path)
    sec = 0
    count = 1
    frame_rate = 1
    total_frames = vidcap.get(
        cv2.CAP_PROP_FRAME_COUNT)//(frame_rate*vidcap.get(cv2.CAP_PROP_FPS)) + 1
    print(total_frames)
    success = getFrame(vidcap, oid, sec, timestamp, total_frames)
    while success:
        sec = sec + frame_rate
        sec = round(sec, 2)
        success = getFrame(vidcap, oid, sec, timestamp, total_frames)

    vidcap.release()
    print('Finished entire process')
    return jsonify({"status": "Video will be processed in a while!"}), 200

# '''
