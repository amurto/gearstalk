import os
from flask import Flask, request, jsonify, make_response, render_template, Response
import json,requests
import time
import cv2
import numpy as np
from skimage import io
import datetime
from flask_pymongo import pymongo
import base64
import datetime
import utils.classification as cf
import utils.colorize as cl


'''*************************************
        import yolo dependencies
*************************************'''

#basic configurations
# derive the paths to the YOLO weights and model configuration

#yolo-tiny weights(less accurate)
weightsPath = "./models/yolo_coco/yolov3-tiny.weights"
configPath = "./models/yolo_coco/yolov3-tiny.cfg"

#yolo weights(more accurate)
# weightsPath = "./models/yolo_base_models/yolov3.weights"
# configPath = "./models/yolo_base_models/yolov3.cfg"

#Load YOLO
net = cv2.dnn.readNet(weightsPath,configPath)
classes = []

# load the COCO class labels our YOLO model was trained on
labelsPath = "./models/yolo_coco/coco.names"
with open(labelsPath,"r") as f:
    classes = [line.strip() for line in f.readlines()]

layer_names = net.getLayerNames()
outputlayers = [layer_names[i[0] - 1] for i in net.getUnconnectedOutLayers()]



'''*************************************
        detect person in the image
*************************************'''

def detect(img):
    img = cv2.resize(img,None,fx=1.0,fy=1.0)
    height,width,channels = img.shape

    #detecting objects
    blob = cv2.dnn.blobFromImage(img,0.00392,(416,416),(0,0,0),True,crop=False)   
    net.setInput(blob)
    outs = net.forward(outputlayers)

    #Showing info on screen/ get confidence score of algorithm in detecting an object in blob
    class_ids=[]
    confidences=[]
    boxes=[]
    frame_output=[]                                                                                #for later use to list the confidences
    for out in outs:
        for detection in out:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]
            if confidence > 0.5 and class_id == 0:                                          #0 is the class_id for person
                center_x= int(detection[0]*width)
                center_y= int(detection[1]*height)
                w = int(detection[2]*width)
                h = int(detection[3]*height)
            
                #cv2.circle(img,(center_x,center_y),10,(0,255,0),2)
                #rectangle co-ordinaters
                x=int(center_x - w/2)
                y=int(center_y - h/2)
                #cv2.rectangle(img,(x,y),(x+w,y+h),(0,255,0),2)
                
                boxes.append([x,y,w,h])                                                     #put all rectangle areas
                confidences.append(float(confidence))                                       #how confidence was that object detected and show that percentage
                class_ids.append(class_id)                                                  #name of the object tha was detected

    indexes = cv2.dnn.NMSBoxes(boxes,confidences,0.4,0.6)

    for i in range(len(boxes)):
        if i in indexes:
            labels = []
            x,y,w,h = boxes[i]
            crop_img = img[y:y+h, x:x+w+40]
            labels = cf.classify(crop_img)                                                  #classification_model(fashion_app)
            color_length = len(labels)

            if color_length != 0:                                                            #if no labels are identified then dont check for color
                colors = cl.colorize(crop_img,color_length)                                              #finding the top 2 colors in the cropped_image
                features = {
                    'box' :  boxes[i],
                    'labels' : labels,
                    'colors' : colors
                }
                frame_output.append(features)
    return frame_output