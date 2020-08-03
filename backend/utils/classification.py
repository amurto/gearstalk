import tensorflow as tf
import tensorflow_hub as hub
import time
import numpy as np
from glob import iglob
import cv2


'''************************************************
        import classification dependencies
************************************************'''

model = tf.keras.models.load_model(('./models/classification/phase2/fashion.h5'),custom_objects={'KerasLayer':hub.KerasLayer})
top = 0,1,5,6,8,9,11,12,13,14,17,19,21
head = 2,4,18
bottom = 3,10,16,20
bags = 7
shoes = 15
pixels = 224
FV_SIZE = 1280
IMAGE_SIZE = (pixels, pixels)
BATCH_SIZE = 64
classes = ['blazer', 'burkha','halfshirt', 'headwear', 'longpants', 'scarf', 'sweater', 'vest', 'bags', 'chudidar', 'hoddie', 'jeans', 'jersey', 'kurta', 'saree', 'shirt', 'shoes', 'skirt', 'strip-dress', 'sunglasses', 'tops', 'trousers', 'tshirt']


'''************************************************
            fashion classification 
************************************************'''

def resize_image(img):
    image = cv2.resize(img, (IMAGE_SIZE[0], IMAGE_SIZE[1]) )
    image = image /255
    
    return image



def classify(image):
    img = resize_image(image)
    probabilities = list(model.predict(np.asarray([img]))[0])


    #numpy method (works faster with more classes.but slow with less number of classes)
    # probabilities = model.predict(np.asarray([img]))[0]
    # result = [classes[np.where(probabilities == i)[0][0]] for i in probabilities[probabilities > 0.1]]

    top_max = max([probabilities[i] for i in top])
    bottom_max = max([probabilities[i] for i in bottom])
    head_max = max([probabilities[i] for i in head])

    # print(classes[probabilities.index(top_max)],top_max,[{classes[i]:probabilities[i]} for i in top])
    # print(classes[probabilities.index(bottom_max)],bottom_max)
    # print(classes[probabilities.index(head_max)],head_max)

    result = [classes[probabilities.index(i)] for i in [top_max,bottom_max,head_max,probabilities[bags],probabilities[shoes]] if i > 0.1]

    return result




# prediction = classify(img)                            #to run the file independently