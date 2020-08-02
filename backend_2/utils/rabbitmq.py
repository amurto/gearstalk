import pika
import json
import os

from app import FashionFrame
from dotenv import load_dotenv

load_dotenv()
# HOSTURL = os.getenv("HOST_URL")
RABBITMQ_USERNAME = os.getenv("RABBITMQ_USERNAME")
RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD")



'''-----------------------------------------
        Consuming packets from rabbitmq
        and adding it into a subprocess
------------------------------------------'''

def rabbitmq_consumer():
    credentials = pika.PlainCredentials('test', 'test')

    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='localhost', credentials=credentials))                       #load_balancer url/ip in (host)
    channel = connection.channel()

    channel.queue_declare(queue='video_frame')

    def callback(ch, method, properties, body):
            print(" [x] Received ")
            FashionFrame(body)


    channel.basic_consume(
        queue='video_frame', on_message_callback=callback, auto_ack=True)

    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()



'''-----------------------------------------
        Producing packets into rabbitmq
                after processing
------------------------------------------'''

def rabbitmq_producer(data):
    credentials = pika.PlainCredentials('test', 'test')

    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='localhost',
                                    credentials=credentials))                       #load_balancer url/ip in (host)
    channel = connection.channel()

    channel.queue_declare(queue='frame_output')

    message = json.dumps(data)
    
    channel.basic_publish(exchange='', routing_key='frame_output', body=message)
    print(" [x] Sent The JSON Data")
    connection.close()



'''-----------------------------------------
        For Realtime Detection (todo)
------------------------------------------'''

'''
def rabbitmq_live(cam_id, lat, lng, url):
    credentials = pika.PlainCredentials('test', 'test')

    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='127.0.1.1', credentials=credentials))
    channel = connection.channel()

    channel.queue_declare(queue='live_data')

    data = {
        "cam_id" : str(cam_id),
        "lat" : lat,
        "lng" : lng,
        "url" : url
    }
    message = json.dumps(data, ensure_ascii=False, indent=4)
    print(message)

    channel.basic_publish(exchange='', routing_key='live_data', body=message)
    print(" [x] Sent The JSON Data")
    connection.close()

'''