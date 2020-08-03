import os
from flask import Blueprint, request, jsonify, current_app as app
from flask_jwt_extended import jwt_required
from utils.connect import client, db, fs, stopwords
from bson.json_util import dumps
from datetime import datetime
import nltk
from nltk.tokenize import word_tokenize
from matplotlib import colors
from nltk.stem import WordNetLemmatizer
from sklearn.metrics.pairwise import cosine_similarity
from utils.colorlist import colours
import datefinder
import itertools
import numpy as np

nltk.download('punkt')
nltk.download('wordnet')

query = Blueprint('query', __name__)
lemmatizer = WordNetLemmatizer()
# importing list of available colors
all_colors = [color[3] for color in colours]
def rgb2hex(r, g, b): return f"#{r:02x}{g:02x}{b:02x}"


'''-----------------------------------
            query functions
-----------------------------------'''

def nlp_text(text):
    tokens = word_tokenize(text)
    prev = ""
    color_values = []
    features = []
    dates = ""
    dates = [str(x.date()) for x in datefinder.find_dates(text)]
    for token in tokens:
        lemmatizer.lemmatize(token)
        if token in all_colors:
            r, g, b, name = colours[all_colors.index(token)]
            color_values.append({"hex": rgb2hex(r, g, b), "rgb": {
                                "r": r, "g": g, "b": b, "a": 1}})
        elif token in stopwords:
            features.append(token)
    return list(set(features)), color_values, dates


def nearest_colour( subjects, query ):
    return min( subjects, key = lambda subject: sum( (s - q) ** 2 for s, q in zip( subject, query ) ) )


'''-----------------------------------
            query-routes
-----------------------------------'''


# returns the list of unique_persons with the best match
@query.route('/search', methods=['POST'])
@jwt_required
def search():
    try:
        data = request.get_json()
        videos = data['videos']
        # print(data['attributes'])
        # print(videos)
        new_attributes = []
        for a in data['attributes']:
            labels = [x.lower() for x in a['labels']]
            colors = [nearest_colour( colours, tuple([c['rgb']['r'],c['rgb']['g'],c['rgb']['b']]))[3] for c in a['colors']]
            if len(labels) == 0 and len(colors) == 0:
                continue
            else:
                best_match = []
                for ids in videos:
                    start_time = datetime(int(ids["start"]["y"]),int(ids["start"]["M"])+1,int(ids["start"]["d"]),int(ids["start"]["h"]),int(ids["start"]["m"]),int(ids["start"]["s"]))
                    end_time = datetime(int(ids["end"]["y"]),int(ids["end"]["M"])+1,int(ids["end"]["d"]),int(ids["end"]["h"]),int(ids["end"]["m"]),int(ids["end"]["s"]))
                    
                    ids_match2 = list(db.unique_person.find({"video_id": ids["id"], "labels": {"$in": labels}, "colors": {"$in": colors},'timestamp': {'$gte': start_time},'timestamp': {'$lte': end_time}},{"_id":0}).limit(2))

                    best_match += ids_match2
                # print(best_match)
                # print(list(itertools.chain(*best_match))
                new_attributes.append(best_match)
        # print(list(itertools.chain(*new_attributes)))
        return dumps(new_attributes),200
    except Exception as e:
        print(e)
        return f"An Error Occured: {e}", 404


# returns the list of labels and colors extracted from a text
@query.route('/text_search', methods=['POST'])
@jwt_required
def text_search():
    try:
        data = request.get_json()
        text = data['text'].lower()
        labels, colors, date = nlp_text(text)
        return jsonify({"success": True, "labels": labels, "colors": colors, "date": date}), 200
    except Exception as e:
        return f"An Error Occured: {e}", 404



# returns metadata of the whole video
@query.route('/metadata/<oid>', methods=['GET'])
@jwt_required
def video_metadata(oid):
    try:
        print(oid)
        if oid == None or len(oid) != 24:
            return jsonify({"success": False, "message": "No Object Id in param."}), 400
        elif "features" not in db.list_collection_names():
            return jsonify({"success": False, "message": "No Collection features."}), 404
        else:
            features = db.features.find_one({"video_id": oid})
            return dumps(features), 200
    except Exception as e:
        return f"An Error Occured: {e}"


# returns the list of unique_persons with the best match
# @query.route('/video/<oid>', methods=['GET'])
# @jwt_required
# def video_search_person(oid):
#     try:
#         if oid == None or len(oid) != 24:
#             return jsonify({"success": False, "message": "No Object Id in param."}), 400
#         elif "features" not in db.list_collection_names():
#             return jsonify({"success": False, "message": "No Collection features."}), 404
#         else:
#             features = db.features.find_one({ "video_id": oid})
#             return jsonify({"status": True, "message": "Retriving video metadata!!", "metadata": dumps(features)}), 200
#     except Exception as e:
#         return f"An Error Occured: {e}"
