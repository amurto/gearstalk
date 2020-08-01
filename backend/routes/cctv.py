from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
import json,requests
from utils.connect import client, db, fs
from utils.geocode import address_resolver
from bson import ObjectId
from datetime import datetime
from bson.json_util import dumps

cctv = Blueprint("cctv", __name__)

'''-----------------------------------
            cctv-crud
-----------------------------------'''

# Get all CCTV objects
@cctv.route('/getcctv', methods=['GET'])
@jwt_required
def getCCTV():
    if "cctv" not in db.list_collection_names():
        return jsonify([]), 200
    else:
        cctvs = list(db.cctv.find({}))
        return dumps(cctvs), 200

# Get CCTV by Id
@cctv.route('/getcctvbyid/<oid>', methods=['GET'])
@jwt_required
def getCCTVById(oid):
    if oid == None:
            return jsonify({"success": False, "message": "No Object Id in param."}), 400
    else:
        if "cctv" not in db.list_collection_names():
            return jsonify({"success": False, "message": "No Collection cctv."}), 404
        else:
            cctv = db.cctv.find_one({ "_id": ObjectId(oid)})
            return dumps(cctv), 200

# Add a CCTV camera and its location to the database
# Send JSON data from Postman
# {"lat": 23.45, "lon": 45.67}
@cctv.route('/addcctv', methods=['POST'])
@jwt_required
def addCCTV():
    location = json.loads(request.data)
    print(location)
    lat = location.get("lat")
    lon = location.get("lon")
    print(lat,lon)
    if lat == None or lon == None:
        return jsonify({"success": False, "message": "Coordinate fields are empty."}), 400
    data = {}
    try:
        data = address_resolver(lat, lon)
    except Exception as e:
        print(e)
    if data == {}:
        return jsonify({"success": False, "message": "Please enter valid coordinates."}), 401
    if data['country'] == "India":
        res = db.cctv.insert_one(data)
        oid = res.inserted_id
        doc = db.cctv.find_one({ "_id": oid })
        print(doc)
        return dumps([doc]), 200
    else:
        print(data['country'])
        message = "Entered coordinates are from " + data['country'] + ". Please select coordinates from within the country."
        return jsonify({"success": False, "message": message}), 405
        
    
# Update CCTV by id
@cctv.route('/updatecctv', methods=['PATCH'])
@jwt_required
def updateCCTV():
    location = json.loads(request.data)
    print(location)
    oid = location.get("oid")
    lat = location.get("lat")
    lon = location.get("lon")
    if lat == None or lon == None:
            return jsonify({"success": False, "message": "Coordinate fields are empty."}), 401
    try:
        data = address_resolver(lat, lon)
    except Exception as e:
        print(e)
    if data == {}:
        return jsonify({"success": False, "message": "Please enter valid coordinates."}), 400
    if data['country'] == "India":
        try:
            newvalues = { "$set": data }
            result = db.cctv.update_one({ "_id": ObjectId(oid)}, newvalues )
            if result.matched_count == 0:
                return jsonify({"success": False, "message": "ObjectId cannot be found."}), 404
            elif result.modified_count == 0:
                return jsonify({"success": False, "message": "Failed to modify document as no changes were made."}), 400
            else:
                return data, 202
        except Exception as e:
            return jsonify({"success": False, "message": "ObjectId is invalid."}), 404
    else:
        print(data['country'])
        message = "Entered coordinates are from " + data['country'] + ". Please select coordinates from within the country."
        return jsonify({"success": False, "message": message}), 406


# Delete CCTV by id
@cctv.route('/deletecctv/<oid>', methods=['DELETE'])
@jwt_required
def deleteCCTV(oid):
    ## Dangerous route
    # return jsonify({"success": False, "message": "Forbidden. This is very dangerous."}), 403
    if oid == None:
            return jsonify({"success": False, "message": "No Object Id in param."}), 400
    else:
        if "cctv" not in db.list_collection_names():
            return jsonify({"success": False, "message": "No Collection cctv."}), 404
        else:
            result = db.cctv.delete_one({"_id": ObjectId(oid)})
            if (result.deleted_count) > 0:
                if "video" in db.list_collection_names():
                    db.video.update_one({ "_id": ObjectId(oid) }, { "$set": { "location_id": None } })
                return jsonify({"success": True, "message": "CCTV successfully deleted."}), 200
            else: 
                return jsonify({"success": False, "message": "CCTV with provided id doesn't exist."}), 404


# Delete all CCTVs in the collection
@cctv.route('/deleteallcctv', methods=['DELETE'])
@jwt_required
def deletAllCCTV():
    ## Dangerous route
    # return jsonify({"success": False, "message": "Forbidden. This is very dangerous."}), 403
    if "cctv" not in db.list_collection_names():
        return jsonify({"success": False, "message": "No Collection cctv."}), 404
    else:
        result = db.cctv.delete_many({})
        if (result.deleted_count) > 0:
            if "video" in db.list_collection_names():
                db.video.update_many({}, { "$set": { "location_id": None } })
            return jsonify({"success": True, "message": "All CCTVs successfully deleted."}), 200
        else: 
            return jsonify({"success": True, "message": "CCTVs collection is already empty"}), 204
