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

ENV MONGODB_URL="mongodb+srv://spartan:bigbang2@spartabot.mhmgn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
ENV BOT_COMMAND="!spartan"
ENV TAG_COMMAND="!all"
ENV CHROME_PATH="/usr/bin/chromium"
ENV HEADLESS=true
ENV TZ="Asia/Kolkata"
ENV WW_SESSION="{\"WABrowserId\":\"\\\"fu4isU0iOSAMqVaFGqMlAA==\\\"\",\"WASecretBundle\":\"{\\\"key\\\":\\\"FK06j8DcYT5fqE05oTZDNV\/OzdRVOzRGLIJomPMecYE=\\\",\\\"encKey\\\":\\\"bXQaRZSy7dK3hus+Nc5dJieOpqONX510\/GEpYWMXzEo=\\\",\\\"macKey\\\":\\\"FK06j8DcYT5fqE05oTZDNV\/OzdRVOzRGLIJomPMecYE=\\\"}\",\"WAToken1\":\"\\\"GTAuk4RrYfQSY5ImSUjUagvNR6juWUF3gSAgIV1IFxM=\\\"\",\"WAToken2\":\"\\\"1@nzANEUPCvlQ\/OpriHpUIulCGWXb8Dk160XjLjiKoLltIbfzSoC1PVU5sO72m3dN4HlfxnDpDcwfp+w==\\\"\"}"

ENV 
COPY . .


EXPOSE 3000
CMD ["node", "app.js" ]
