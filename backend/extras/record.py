import urllib.request
import time
from skimage import io
import cv2

# cap = cv2.VideoCapture("http://192.168.0.103:8080/video")

# while(True):
#     ret, frame = cap.read()

# print("Recording video...")
# # response = urllib.request.urlopen("http://10.64.221.236:8080/video")
# filename = time.strftime("%Y%m%d%H%M%S",time.localtime())+".avi"
# f = open(filename, 'wb')

# video_file_size_start = 0  
# video_file_size_end = 1048576 * 2  # end in 7 mb 
# block_size = 1024

# while True:
#     try:
#         ret, buffer = cap.read()
#         if not buffer:
#             break
#         video_file_size_start += len(buffer)
#         if video_file_size_start > video_file_size_end:
#             break
#         f.write(buffer)

#     except Exception(e):
#         logger.exception(e)
# f.close()

import time
import requests


# print("Recording video...")
# filename = time.strftime("%Y%m%d%H%M%S",time.localtime())+".avi"
# file_handle = open(filename, 'wb')
# chunk_size = 1024

# start_time_in_seconds = time.time()

# time_limit = 5 # time in seconds, for recording
# time_elapsed = 0
url = "http://192.168.0.103:8080/video"
# while True:
#     if time_elapsed > time_limit:
#         break
#     # to print time elapsed   
#     if int(time.time() - start_time_in_seconds)- time_elapsed > 0 :
#         time_elapsed = int(time.time() - start_time_in_seconds)
#         print(time_elapsed, end='\r', flush=True)
    
# image = cv2.cvtColor(io.imread(url), cv2.COLOR_BGR2RGB)
# cv2.imshow("jrsg",image)
print(url)
import requests

# def liveframe(url):
#     #status
#     status = requests.get(url).status_code
#     print(status)
#     #image
#     image = cv2.cvtColor(io.imread(url), cv2.COLOR_BGR2RGB)

#     return status, image

# status,image = liveframe(url)

cv2.imshow("fygr","image")
cv2.waitKey(0)