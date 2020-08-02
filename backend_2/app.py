import json,requests
import time
import cv2
import numpy as np
from skimage import io
import datetime
import base64
import datetime

#Processing_models
import utils.yolo as yolo
# import utils.database as database
import utils.rabbitmq as rabbitmq

#concurrent_futures subprocessing
import concurrent.futures


executor = concurrent.futures.ProcessPoolExecutor(max_workers=3)

# '''************************************************
#                 Processing-Functions
# ************************************************'''

# def index():
#     try:
#         return '''
#             <h1><b>GEARSTALK-BACKEND-2</b></h1>
#         '''
#     except Exception as e:
#         return f"An Error Occured: {e}"



''' -------------------------------------------------
        Recives image_frames and processes it
----------------------------------------------------'''

def FashionFrame(data):
    try:
        start = time.time()
        data = json.loads(data)
        # data = json.load(request.files['data']) 
        video_id = data['video_id']
        frame_sec = data['frame_sec']
        total_frames = data['total_frames']
        timestamp = data['timestamp']
        image = data['photo']


        '''      convert the filestorge image to cv2 format       '''
        # (using file system instead)
        original = base64.b64decode(image)                                                   # to convert the string image to image buffer
        np_image = np.frombuffer(original, dtype=np.uint8)                                      # convert string data to numpy array
        img = cv2.imdecode(np_image, flags=1)                                                   # convert numpy array to image

        
        '''      detection and classification       '''
        # (using tiny-yolo could reduce accuracy)
        frame_details = yolo.detect(img)


        # '''      writing into the database       '''
        # (either save here or return and save)
        # status,message = database.save_frame(video_id,frame_details,timestamp,frame_sec)
        # end = time.time()
        # print(end-start)


        '''      Reverting back the data to the host       '''

        # frame_details = [{
        #         "frame_sec" : frame_sec,
        #         "persons" : json.dumps(frame_output)
        #     }]
        
        data = {
            "video_id": video_id,
            "frame_details" : json.dumps(frame_details),
            "frame_sec": frame_sec,
            "total_frames": total_frames,
            "timestamp": timestamp
        }

        #adding the processed output back to the rabbbitmq-queue
        rabbitmq.rabbitmq_producer(data)


        print({"success": data})
        

        return "jsonify(), 200"
    except Exception as e:
        return f"An Error Occured: {e}"



#todo

''' -------------------------------------------------
        Recives the url and processes it
            (For realtime detection)
----------------------------------------------------'''

# @app.route('/live', methods=['POST'])
# def livestream():
#     try:
#         data = request.get_json()
#         cam_id = data['cam_id']
#         lat = data['lat']
#         lng = data['lng']
#         url = data['url']

#         #image
#         image = cv2.cvtColor(io.imread(url), cv2.COLOR_BGR2RGB)

#         features = detect(image)

#         #datetime
#         currentDT = datetime.datetime.now()
#         frame_time = currentDT.strftime("%I:%M:%S %p")
#         frame_date = currentDT.strftime("%b %d, %Y")
#         frame_day = currentDT.strftime("%a")

#         mydata = {
#             "cam_id" : cam_id,
#             "lat" : lat,
#             "lng" : lng,
#             "features" : features,
#             "date" : frame_date,
#             "time" : frame_time,
#             "day" : frame_day
#         }

#         db.live.insert(mydata)

#         return jsonify(mydata), 200
#     except Exception as e:
#         return f"An Error Occured: {e}"



if __name__ == '__main__':
    # app.run(host="0.0.0.0", debug=True, use_reloader=True, threaded=True)
    try:
        while True:
            executor.submit(rabbitmq.rabbitmq_consumer)
    except KeyboardInterrupt:
        quit = True
    
