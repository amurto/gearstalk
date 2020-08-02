import os
from dotenv import load_dotenv
from flask_pymongo import pymongo
import googlemaps

load_dotenv()
# CONNECTION_STRING = os.getenv("MONGODB_STRING")
CONNECTION_STRING = os.getenv("MONGODB_STRING_CLOUD")
# print(CONNECTION_STRING)
GOOGLEMAPS_KEY = os.getenv("GOOGLE_MAPS_KEY")

client = pymongo.MongoClient(CONNECTION_STRING)
db = client.get_database('gearstalk')
print("connected to the gearstalk db!!")
gmaps = googlemaps.Client(key=GOOGLEMAPS_KEY)