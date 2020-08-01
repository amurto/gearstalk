import mimetypes
import os
import re
import base64
from flask import Blueprint, request, jsonify, Response
from flask_jwt_extended import jwt_required
from utils.connect import client, db, fs
from utils.utils import allowed_file, getFrame, online, randomString
from bson import ObjectId
from datetime import datetime
from bson.json_util import dumps
import wave
import speech_recognition as sr

r = sr.Recognizer()

helpers = Blueprint("helpers", __name__)

@helpers.after_request
def after_request(response):
    response.headers.add('Accept-Ranges', 'bytes')
    return response

@helpers.route('/file/<fileid>') 
def file(fileid):
    if len(fileid) != 24:
        return jsonify({"message": "Bad Request"}), 206
    oid = ObjectId(fileid)
    grid_out = fs.open_download_stream(oid)
    contents = grid_out.read()
    return contents

## Byte Streaming for Video
@helpers.route('video/<fileid>')
def video(fileid):
    if len(fileid) != 24:
        return jsonify({"message": "Bad Request"}), 206
    oid = ObjectId(fileid)
    grid_out = fs.open_download_stream(oid)

    range_header = request.headers.get('Range', None)
    if not range_header: 
        contents = grid_out.read()
        return contents
    
    size = grid_out.length   
    byte1, byte2 = 0, None
    
    m = re.search('(\d+)-(\d*)', range_header)
    g = m.groups()
    
    if g[0]: byte1 = int(g[0])
    if g[1]: byte2 = int(g[1])

    length = size - byte1
    if byte2 is not None:
        length = byte2 + 1 - byte1
    
    data = None
    
    grid_out.seek(byte1)
    data = grid_out.read(length)
    rv = Response(data, 
        206,
        mimetype=mimetypes.guess_type(grid_out.filename)[0], 
        direct_passthrough=True)
    rv.headers.add('Content-Range', 'bytes {0}-{1}/{2}'.format(byte1, byte1 + length - 1, size))
    rv.headers.add('Cache-Control', 'no-cache')
    return rv

@helpers.route('/speech', methods=['POST']) 
@jwt_required
def speech():
    speech = request.files['speech']
    name = 'saves/' + randomString() + '.wav'
    nchannels = 2
    sampwidth = 2
    framerate = 44100
    nframes = 128000
    audio = wave.open(name, 'wb')
    audio.setnchannels(nchannels)
    audio.setsampwidth(sampwidth)
    audio.setframerate(framerate)
    audio.setnframes(nframes)

    blob = speech.read() # such as `blob.read()`
    audio.writeframesraw(blob)
    audio.close()

    test = sr.AudioFile(name)
    with test as source:
        text = r.record(source)
    try:
        val = r.recognize_google(text, show_all=True)
        fin = val['alternative'][0]['transcript']
    except Exception as e:
        fin = ""
    if os.path.exists(name):
        os.remove(name)
    return jsonify({"message": fin}), 200