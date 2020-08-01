import os
from flask import Flask, request, jsonify, make_response, render_template, Response, Flask, flash, redirect, url_for
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
from flask_cors import CORS
import json,requests
import cv2
import numpy as np
from bson import ObjectId
from datetime import datetime
from bson.json_util import dumps
from utils.geocode import address_resolver, geocode_address
from routes.auth import auth
from routes.cctv import cctv
from routes.video import video
from routes.helpers import helpers
from routes.process import process, executor
from routes.query import query
from routes.report import report
from utils.connect import client, db, fs

import threading
from werkzeug.utils import secure_filename
import base64
from utils.utils import AfterResponse, getFirstFrame, allowed_file, getFrame, online
from utils.rabbitmq import rabbitmq_live

try:
    os.mkdir('saves')
except FileExistsError as e:
    pass

app = Flask(__name__)
jwt = JWTManager(app)

# JWT Config
app.config["JWT_SECRET_KEY"] = "this-is-secret-key"

app.config['UPLOAD_FOLDER'] = 'saves'
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app)
executor.init_app(app)
app.register_blueprint(auth, url_prefix="/auth")
app.register_blueprint(cctv, url_prefix="/cctv")
app.register_blueprint(video, url_prefix="/video")
app.register_blueprint(helpers, url_prefix="/helpers")
app.register_blueprint(process, url_prefix="/process")
app.register_blueprint(query, url_prefix="/query")
app.register_blueprint(report, url_prefix="/report")

@app.route('/test', methods=['GET'])
def test():
    return jsonify({ "message": "Hello World" }),200


if __name__ == '__main__':
    app.run(debug=True, use_reloader=True, threaded=True)
