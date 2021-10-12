FROM python:3.8-alpine
ENV PYTHONUNBUFFERED 1

RUN apk add bash
RUN apk add vim

RUN mkdir /stats_tracker
WORKDIR /stats_tracker

ADD stats_tracker ./
ADD requirements.txt ./

RUN pip install --upgrade pip && pip install -r requirements.txt

ARG server_mode=development
ENV SERVER_MODE=$server_mode
CMD gunicorn --reload --bind 0.0.0.0:5000 "app:create_app('$SERVER_MODE')"
