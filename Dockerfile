FROM node:16.4.2

WORKDIR /home/node/mikuBot
COPY package*.json ./
COPY yarn.lock ./
RUN npm install

RUN apt update && \
    apt install -y \ 
    chromium\
    ffmpeg


RUN wget https://yt-dl.org/downloads/latest/youtube-dl -O /usr/local/bin/youtube-dl
RUN chmod a+rx /usr/local/bin/youtube-dl

RUN npm install whatsapp-web.js
RUN ln -s /bin/bash /usr/bin/bash

# ENV MONGODB_URL= Mongo DB url
# ENV BOT_COMMAND= Bot command
# ENV TAG_COMMAND= command for mentioning all people in group
ENV CHROME_PATH="/usr/bin/chromium"
ENV HEADLESS=true
ENV TZ="Asia/Kolkata"
# ENV WW_SESSION= whatsapp session details

ENV 
COPY . .


EXPOSE 3000
CMD ["node", "app.js" ]
