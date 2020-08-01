import os
import time
import json
import requests
from flask import Blueprint, request, jsonify, render_template, make_response
from flask_jwt_extended import jwt_required
from utils.connect import client, db, fs
from utils.geocode import address_resolver
from bson import ObjectId
from werkzeug.utils import secure_filename
from datetime import datetime
from bson.json_util import dumps
from utils.utils import getFirstFrame, allowed_file, randomString
from collections import Counter
from itertools import chain
import matplotlib.pyplot as plt

video = Blueprint("video", __name__)

record = ['None', 'Today', 'This Week', 'This Month', 'This Year']
duration = ['None', 'Short (<4 minutes)',
            'Medium (>4 minutes and <20 minutes)', 'Long (>20 minutes)']
sort = ['Relevance', 'Upload Date', 'Duration']
typeOf = ['None', 'Processed', 'Unprocessed']





'''-----------------------------------
            visualization
-----------------------------------'''


@video.route('/toggle_chart/<oid>', methods=['GET'])
def toggle_chart(oid):
    try:
        if oid == None or len(oid) != 24:
            return jsonify({"success": False, "message": "No Object Id in param."}), 400
        elif "unique_person" not in db.list_collection_names():
            return jsonify({"success": False, "message": "No Collection features."}), 404
        else:
            data = db.unique_person.find(
                {"video_id": oid}, {"labels": 1, "colors": 1, "_id": 0})
            new_data = [
                [x+','+y for x, y in zip(t['labels'], t['colors'])] for t in data]
            meta = [_ for i in range(len(new_data)) for _ in new_data[i]]
            cc = Counter(meta)
            features = [{"from": key.split(",")[0], "to": key.split(",")[
                1], "value": cc[key]} for key in cc]
            return jsonify({"status": True, "message": "Toggle Chord Chart!!", "metadata": features}), 200
    except Exception as e:
        return f"An Error Occured: {e}"


# method to get data from the database to the javascript of the line graph.
@video.route('/visual/<oid>', methods=['GET'])
def makeCharts(oid):
    # oid = "5ef4dc433f16cd00b13a67e8"
    if oid == None or len(oid) != 24:
        return jsonify({"success": False, "message": "No Object Id in param."}), 400
    feature = db.features.find_one({"video_id": oid})
    frame_sec_array = []
    labels_array = []
    line_chart = []
    big_data = []
    big_data2 = []
    y_axis = []
    x_axis = []
    object_demo = feature["metadata"]
    for object_small in object_demo:
        frame_sec = object_small["frame_sec"]
        x_axis.append(frame_sec)
        cnt = Counter()
        key_array = []
        value_array = []
        dict_array = []
        x = []
        dict_new = {}
        person = object_small["persons"]
        person1 = json.loads(person)
        y_axis.append(len(person1))
        for i in person1:
            x.append(i["labels"])
        merged = list(chain(*x))

        for i in merged:
            cnt[i] += 1
        new_cnt = dict(cnt)

        for key, value in new_cnt.items():
            key_array.append(key)
            value_array.append(value)

        for i in range(len(key_array)):
            res = {"labels": key_array[i], "count": value_array[i]}
            dict_new.update({key_array[i]: value_array[i]})
            # print(res)
            dict_array.append(res)
        # # print(dict_array)
        line_dict = {"date": frame_sec, "value": len(person1)}
        dict_new2 = {"frame_sec": str(frame_sec), "Number of People": len(
            person1), "feature_label": dict_array}
        big_data.append(dict_new2)
        line_chart.append(line_dict)
        big_data2.append(dict_new)

    counter = Counter()
    for d in big_data2:
        counter.update(d)

    result = dict(counter)
    for key, value in result.items():
        res = {"category": key, "value1": value}
        labels_array.append(res)

    return jsonify({"linechart": line_chart, "big_data": big_data, "labels_array": labels_array}), 200


'''-----------------------------------
            end
-----------------------------------'''


def sameWeek(dateString):
    d1 = datetime.strptime(dateString, '%Y-%m-%d')
    d2 = datetime.today()
    return d1.isocalendar()[1] == d2.isocalendar()[1] \
        and d1.year == d2.year


def sameMonth(dateString):
    d1 = datetime.strptime(dateString, '%Y-%m-%d')
    d2 = datetime.today()
    print(d1.month, d2.month)
    return d1.month == d2.month \
        and d1.year == d2.year


def filterNone(filter):
    if filter['record'] == record[0] and filter['duration'] == duration[0] and filter['sort'] == sort[0] and filter['type'] == typeOf[0]:
        return None
    else:
        return True


def filterByRecord(recordVal, videos):
    if recordVal == record[0]:
        return videos
    elif recordVal == record[1]:
        items = []
        today = str(datetime.today().date())
        for v in videos:
            if v['date'] == today:
                items.append(v)
        return items
    elif recordVal == record[2]:
        items = []
        for v in videos:
            if sameWeek(v['date']):
                items.append(v)
        return items
    elif recordVal == record[3]:
        items = []
        for v in videos:
            if sameMonth(v['date']):
                items.append(v)
        return items
    elif recordVal == record[4]:
        items = []
        for v in videos:
            if datetime.strptime(v['date'], '%Y-%m-%d').year == datetime.today().year:
                items.append(v)
        return items
    else:
        return videos


def filterByDuration(durationVal, videos):
    if durationVal == duration[0]:
        return videos
    elif durationVal == duration[1]:
        items = []
        for v in videos:
            if int(v['duration'][0:2]) * 60 + int(v['duration'][3:5]) < 4:
                items.append(v)
        return items
    elif durationVal == duration[2]:
        items = []
        for v in videos:
            if int(v['duration'][0:2]) * 60 + int(v['duration'][3:5]) > 4 \
                    and int(v['duration'][0:2]) * 60 + int(v['duration'][3:5]) < 20:
                items.append(v)
        return items
    elif durationVal == duration[3]:
        items = []
        for v in videos:
            if int(v['duration'][0:2]) * 60 + int(v['duration'][3:5]) > 20:
                items.append(v)
        return items
    else:
        return videos


def filterByType(typeVal, videos):
    if typeVal == typeOf[0]:
        return videos
    elif typeVal == typeOf[1]:
        items = []
        for v in videos:
            if v['prepared'] == True:
                items.append(v)
        return items
    elif typeVal == typeOf[1]:
        items = []
        for v in videos:
            if v['prepared'] == False:
                items.append(v)
        return items
    else:
        return videos


def sortBy(sortVal, videos):
    if sortVal == sort[0]:
        return videos
    elif sortVal == sort[1]:
        videos.sort(key=lambda x: datetime.strptime(
            x['date'], '%Y-%m-%d'), reverse=True)
        for v in videos:
            print(v['date'])
        return videos
    elif sortVal == sort[2]:
        videos.sort(key=lambda x: int(x['duration'][0:2]) * 3600 + int(
            x['duration'][3:5]) * 60 + int(x['duration'][6:8]), reverse=True)
        return videos
    else:
        return videos


'''-----------------------------------
            video-crud
-----------------------------------'''

# Get all Video documents


@video.route('/getvideo', methods=['GET'])
@jwt_required
def getVideo():
    if "video" not in db.list_collection_names():
        return jsonify([]), 200
    else:
        videos = list(db.video.find({}))
        return dumps(videos), 200

# Get Video by cctv id


@video.route('/getvideobycctv/<oid>', methods=['GET'])
@jwt_required
def getVideoByCCTV(oid):
    if oid == None:
        return jsonify({"success": False, "message": "No Object Id in param."}), 400
    else:
        if "video" not in db.list_collection_names():
            return jsonify({"success": False, "message": "No Collection video."}), 404
        else:
            video = db.video.find({"location_id": oid, "prepared": True})
            return dumps(video), 200


# Get Video by id
@video.route('/getvideobyid/<oid>', methods=['GET'])
@jwt_required
def getVideoById(oid):
    if oid == None:
        return jsonify({"success": False, "message": "No Object Id in param."}), 400
    else:
        if "video" not in db.list_collection_names():
            return jsonify({"success": False, "message": "No Collection video."}), 404
        else:
            video = db.video.find_one({"_id": ObjectId(oid)})
            return dumps(video), 200

# Returns videos for a search query


@video.route('getvideostats', methods=['GET'])
@jwt_required
def getVideoStats():
    if "video" not in db.list_collection_names():
        return jsonify({"success": False, "message": "No Video Collection."}), 400
    else:
        count = db.video.find({}).count()
        prepared = db.video.find({"prepared": True}).count()
        unprepared = count - prepared
        return jsonify({"success": True, "count": count, "prepared": prepared, "unprepared": unprepared}), 200


@video.route('getrecentvideo', methods=['GET'])
@jwt_required
def getRecentVideo():
    if "video" not in db.list_collection_names():
        return jsonify({"success": False, "message": "No Video Collection."}), 400
    else:
        videos = list(db.video.find({}))
        videos.sort(key=lambda x: datetime.strptime(
            x['date'], '%Y-%m-%d'), reverse=True)
        if len(videos) > 4:
            videos = videos[:4]
        return dumps(videos), 200


@video.route('/search', methods=['POST'])
@jwt_required
def getVideoSearch():
    data = json.loads(request.data)
    search = data.get("search")
    if "video" not in db.list_collection_names() or search == None or search == "":
        return jsonify([]), 200
    else:
        videos = list(db.video.find({}))
        items = []
        for v in videos:
            if search.lower() in v['name'].lower():
                items.append(v)

        return dumps(items), 200


@video.route('/filter', methods=['POST'])
@jwt_required
def getVideoFilter():
    data = json.loads(request.data)
    filter = data.get("filter")
    print(filter)
    if "video" not in db.list_collection_names() or filter == None:
        return jsonify([]), 200
    elif filterNone(filter) == None:
        videos = list(db.video.find({}))
        return dumps(videos), 200
    else:
        videos = list(db.video.find({}))
        videos = filterByRecord(filter['record'], videos)
        videos = filterByDuration(filter['duration'], videos)
        videos = filterByType(filter['type'], videos)
        videos = sortBy(filter['sort'], videos)
        return dumps(videos), 200

# Upload a video to the database


@video.route('/addvideo', methods=['POST'])
@jwt_required
def addVideo():
    file = request.files['video']
    timestamp = request.form.get("time")
    location = request.form.get("location")
    name = file.filename
    name = os.path.splitext(name)[0]
    if file and allowed_file(file.filename):
        if file.filename == None:
            filename = "Unknown_video"
        else:
            filename = secure_filename(file.filename)

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


'''
# Update Video by id
@video.route('/updatevideo', methods=['POST'])
def updateVideo():
    file = request.files['video']
    if file.filename == None:
        filename = "Unknown.video"
    else:
        filename = str(file.filename)
    oid = fs.upload_from_stream(filename, file)
    f = open('saves/test.mp4','wb+')
    fs.download_to_stream(oid, f)
    f.close()
    try:
        thumbnail = getFirstFrame('saves/test.mp4')
    except Exception as e:
        return jsonify({"success": False, "message": "Failed to process video"}), 500

    thumbnail_oid = fs.upload_from_stream(str(oid), thumbnail)
    return jsonify({
        "success": True, 
        "message": "Video successfully uploaded",
        "video": str(oid),
        "thumbnail": str(thumbnail_oid)
    }), 200

'''

# Update Video Location


@video.route('/updatevideolocation', methods=['PATCH'])
@jwt_required
def updateVideoLocation():
    data = json.loads(request.data)
    video_id = data.get("video_id")
    location_id = data.get("location_id")
    if video_id == None or location_id == None:
        return jsonify({"success": False, "message": "Fields are empty."}), 401
    try:
        location = db.cctv.find_one({"_id": ObjectId(location_id)})
    except Exception as e:
        print(e)
        return jsonify({"success": False, "message": "Camera not found in database."}), 401
    result = db.video.update_one({"_id": ObjectId(video_id)}, {
                                 "$set": {"location_id": str(location["_id"])}})
    if result.matched_count == 0:
        return jsonify({"success": False, "message": "ObjectId cannot be found."}), 404
    elif result.modified_count == 0:
        video = db.video.find_one({"_id": ObjectId(video_id)})
        return dumps(video), 201
    else:
        video = db.video.find_one({"_id": ObjectId(video_id)})
        return dumps(video), 200

# Update Video Timestamp
@video.route('/updatevideotimestamp', methods=['PATCH'])
@jwt_required
def updateVideoTimestamp():
    data = json.loads(request.data)
    video_id = data.get("video_id")
    timestamp = data.get("time")
    if video_id == None or timestamp == None:
        return jsonify({"success": False, "message": "Fields are empty."}), 401
    tmz_str = ' GMT+0530 (India Standard Time)'
    if timestamp.endswith(tmz_str):
        timestamp = timestamp.replace(tmz_str, '')
    date_time_obj = None
    try:
        date_time_obj = datetime.strptime(timestamp, '%a %b %d %Y %H:%M:%S')
    except Exception as e:
        print(e)
        pass
    if date_time_obj == None:
        return jsonify({
            "success": False,
            "message": "Timestamp is invalid. Please try again!"
        }), 403
    result = db.video.update_one(
        {"_id": ObjectId(video_id)},
        {"$set": {
            "date": str(date_time_obj.date()),
            "time": str(date_time_obj.time())
        }})
    if result.matched_count == 0:
        return jsonify({"success": False, "message": "ObjectId cannot be found."}), 404
    elif result.modified_count == 0:
        video = db.video.find_one({"_id": ObjectId(video_id)})
        return dumps(video), 201
    else:
        video = db.video.find_one({"_id": ObjectId(video_id)})
        return dumps(video), 200

# Delete Video by id
@video.route('/deletevideo/<oid>', methods=['DELETE'])
@jwt_required
def deleteVideo(oid):
    if oid == None:
        return jsonify({"success": False, "message": "No Object Id in param."}), 400
    else:
        if "video" not in db.list_collection_names():
            return jsonify({"success": False, "message": "No Collection video."}), 404
        else:
            video = db.video.find_one({"_id": ObjectId(oid)})
            try:
                fs.delete(ObjectId(video["file_id"]))
                fs.delete(ObjectId(video["thumbnail_id"]))
            except Exception as e:
                print(e)
                return jsonify({"success": False, "message": "Delete operation failed."}), 404
            result = db.video.delete_one({"_id": ObjectId(oid)})
            if (result.deleted_count) > 0:
                return jsonify({"success": True, "message": "Video successfully deleted."}), 200
            else:
                return jsonify({"success": False, "message": "Video with provided id doesn't exist."}), 404
