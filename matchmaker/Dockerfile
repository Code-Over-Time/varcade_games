FROM python:3.8-alpine
ENV PYTHONUNBUFFERED 1

RUN apk add bash
RUN apk add vim

RUN mkdir /matchmaker
WORKDIR /matchmaker

ADD matchmaker ./
ADD requirements.txt ./

RUN pip install --upgrade pip && pip install -r requirements.txt

ARG server_mode=development
ENV SERVER_MODE=$server_mode
CMD gunicorn --reload --bind 0.0.0.0:5050 "app:create_app('$SERVER_MODE')"
