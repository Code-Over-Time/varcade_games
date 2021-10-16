FROM python:3.8-alpine
ENV PYTHONUNBUFFERED 1

RUN apk add alpine-sdk
RUN apk add bash
RUN apk add vim
RUN apk add mariadb-dev
RUN apk add jpeg-dev
RUN apk add libpng-dev
RUN apk add libffi-dev

RUN mkdir /game_portal
WORKDIR /game_portal

ADD game_portal ./
ADD requirements.txt ./

RUN pip install --upgrade pip && pip install -r requirements.txt

CMD gunicorn game_portal.wsgi:application --bind 0.0.0.0:8000 --reload 