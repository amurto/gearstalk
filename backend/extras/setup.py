import os
import json,requests
import cv2
import numpy as np
from flask_pymongo import pymongo
from gridfs import GridFSBucket
from bson import ObjectId
from dotenv import load_dotenv
import googlemaps
from datetime import datetime

load_dotenv()
GOOGLEMAPS_KEY = os.getenv("GOOGLE_MAPS_KEY")
CONNECTION_STRING = os.getenv("MONGODB_STRING")

client = pymongo.MongoClient(CONNECTION_STRING)
db = client.get_database('gearstalk')
fs = GridFSBucket(db)
gmaps = googlemaps.Client(key=GOOGLEMAPS_KEY)

def address_resolver(lat, lon):
    # Reverse Geocoding with latitude and longitude
    json = gmaps.reverse_geocode((lat, lon))
    final = {}

    # Parse response into formatted location
    if json:
        data = json[0]
        for item in data['address_components']:
            for category in item['types']:
                data[category] = {}
                data[category] = item['long_name']
        final['formatted_address'] = data['formatted_address']
        final['street'] = data.get("route", None)
        final['state'] = data.get("administrative_area_level_1", None)
        final['city'] = data.get("locality", None)
        final['county'] = data.get("administrative_area_level_2", None)
        final['country'] = data.get("country", None)
        final['postal_code'] = data.get("postal_code", None)
        final['neighborhood'] = data.get("neighborhood",None)
        final['sublocality'] = data.get("sublocality", None)
        final['housenumber'] = data.get("housenumber", None)
        final['postal_town'] = data.get("postal_town", None)
        final['subpremise'] = data.get("subpremise", None)
        final['latitude'] = data.get("geometry", {}).get("location", {}).get("lat", None)
        final['longitude'] = data.get("geometry", {}).get("location", {}).get("lng", None)
        final['location_type'] = data.get("geometry", {}).get("location_type", None)
        final['postal_code_suffix'] = data.get("postal_code_suffix", None)
        final['street_number'] = data.get('street_number', None)
    return final 


def setup():
    cctvs = [
        [19.0728302, 72.8826065],
        [28.6519508, 77.2314911],
        [12.97194, 77.593689],
        [22.5626297, 88.3630371],
        [13.0878401, 80.2784729],
        [23.0257893, 72.5872726],
        [17.3840504, 78.4563599],
        [18.5195694, 73.8553467],
        [21.19594, 72.8302307],
        [26.4652309, 80.3497467],
        [26.9196205, 75.7878113],
        [19.0368099, 73.0158234]
    ]
    for camera in cctvs:
        data = address_resolver(camera[0], camera[1])
        if data['country'] == 'India':
            db.cctv.insert_one(data)
    print("CCTVs succesfully added")

if __name__ == '__main__':
    setup()