# from threading import Thread
import cv2
import numpy as np
import requests
from skimage import io

# derive the paths to the YOLO weights and model configuration
weightsPath = "./yolo_coco/yolov3.weights"
configPath = "./yolo_coco/yolov3.cfg"

#Load YOLO
net = cv2.dnn.readNet(weightsPath,configPath)
classes = []

# load the COCO class labels our YOLO model was trained on
labelsPath = "./yolo_coco/coco.names"
with open(labelsPath,"r") as f:
    classes = [line.strip() for line in f.readlines()]

layer_names = net.getLayerNames()
outputlayers = [layer_names[i[0] - 1] for i in net.getUnconnectedOutLayers()]

class DetectStream(object):
    # def __init__(self, img=None):
    #     self.img = img

    def liveframe(self,url):
        #status
        status = requests.get(url).status_code

        #image
        image = cv2.cvtColor(io.imread(url), cv2.COLOR_BGR2RGB)

        return status, image

    def detect(self,img):
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
            l=[]                                                                                #for later use to list the confidences
            for out in outs:
                for detection in out:
                    scores = detection[5:]
                    class_id = np.argmax(scores)
                    confidence = scores[class_id]
                    if confidence > 0.5:
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

            font = cv2.FONT_HERSHEY_COMPLEX_SMALL
            for i in range(len(boxes)):
                if i in indexes:
                    x,y,w,h = boxes[i]
                    name = str(classes[class_ids[i]])
                    if name == 'person':
                        crop_img = img[y:y+h, x:x+w+40]
                        # cv2.imwrite('messigray.png',crop_img)
                        # cv2.imshow("cropped", crop_img)
                        # cv2.waitKey(0)
                        # features = df2.fashion(crop_img)
                        features = ['poop']
                        l.append('{}:{}'.format(name,features))
            return l