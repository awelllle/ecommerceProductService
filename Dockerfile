FROM mhart/alpine-node:10
RUN apk --no-cache add --virtual \
      builds-deps \
      build-base \
      python

RUN cd /

RUN mkdir microservice

RUN cd microservice

WORKDIR /microservice

ADD . /microservice

RUN chmod +x /microservice/run.sh

RUN npm cache clean --force 

RUN npm install

CMD ./run.sh