FROM python:3.7-slim

WORKDIR /app
RUN apt-get update && apt-get -y dist-upgrade
RUN apt install -y netcat
COPY requirements.txt /app
RUN pip install -r  /app/requirements.txt

COPY mediator.py /app


