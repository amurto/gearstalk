import os
from dotenv import load_dotenv
from flask_pymongo import pymongo
from gridfs import GridFSBucket
import googlemaps

load_dotenv()
CONNECTION_STRING = os.getenv("MONGODB_STRING_CLOUD")
GOOGLEMAPS_KEY = os.getenv("GOOGLE_MAPS_KEY")
RABBITMQ_HOST = os.getenv("RABBITMQ_HOST")
RABBITMQ_USERNAME = os.getenv("RABBITMQ_USERNAME")
RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD")

client = pymongo.MongoClient(CONNECTION_STRING)
db = client.get_database('gearstalk')
fs = GridFSBucket(db)
gmaps = googlemaps.Client(key=GOOGLEMAPS_KEY)

stopwords =  ['blazer', 'burkha','halfshirt', 'headwear', 'longpants', 'scarf', 'sweater', 'vest', 'bags', 'chudidar', 'hoddie', 'jeans', 'jersey', 'kurta', 'saree', 'shirt', 'shoes', 'skirt', 'strip-dress', 'sunglasses', 'tops', 'trousers', 'tshirt']