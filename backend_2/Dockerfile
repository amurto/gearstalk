FROM python:3.7-slim 

RUN apt-get update \ 
&& apt-get install libgtk2.0-dev -y \
&& apt-get clean
COPY requirements.txt /app/requirements.txt
WORKDIR /app

RUN pip3 install -r  /app/requirements.txt

ADD . /app
CMD ["python", "app.py"]


