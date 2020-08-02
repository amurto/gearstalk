from flask import Blueprint, request, jsonify
import json,requests
from utils.connect import client, db
from bson import ObjectId
from datetime import datetime
from bson.json_util import dumps,loads


#todo

'''-----------------------------------
        saving to the database
-----------------------------------'''

# find the cctv collection with camera_id
#if not there, then create one
#if already exits then append the new person's details into the collection


def save_frame(video_id,frame_output,timestamp,frame_sec):
    if video_id == None:
        status = False
        message = "No video_Id in param."
        return status,message
    else:
        features = db.features.find_one({ "video_id": video_id,"timestamp": timestamp})
        # print(features)
        if features == None:
            frame_details = [{
                "frame_sec" : frame_sec,
                "persons" : dumps(frame_output)
            }]
            db.features.insert_one({
                "video_id": video_id,
                "timestamp": timestamp,
                "metadata" : frame_details
            })
            status = True
            message = "Frame output successfully added to the db!!"
        else:
            frame_details = {
                "frame_sec" : frame_sec,
                "persons" : dumps(frame_output)
            }
            newvalues = { "$push": {"metadata" : frame_details }}
            result = db.features.find_and_modify({ "_id": ObjectId(features['_id'])}, newvalues )
            status = True
            message = "Frame output successfully added to the db!!"
        
        return status,message




'''-----------------------------------
    narrowing down the database
-----------------------------------'''

#fetch all the data of the cctv collection
#compare the each frame with the next frame and remove duplicates
#identify the unique person in frames with the last seen timestamp
#save the details into a new collection

'''
def video_narrow(video_id,cctv_id,frame_output,timestamp):
    if video_id == None:
        status = False
        message = "No Object Id in param."
        return status,message
    else:
        if "cctv" not in db.list_collection_names():
            status = False
            message = "No Object Id in param."
            return status,message
        else:
            cctv = db.cctv.find_one({ "_id": ObjectId(video_id)})
            status = False
            message = "No Object Id in param."
            return status,message

'''