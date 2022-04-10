'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: "NTwTQ3KO0jpZrRfDsnbnywZDRQcLjJvq4ljY9QbCEBnd3mw8nXGK8uPMOn8wVNFRXDPkJJ9S5pntoWQXUN+xU4bGxP1DDzRa13ALWKdXHyyCYrI/TsFH1siDLnFyyXrjZpNxKsFhhCNfSQojJ3bECwdB04t89/1O/w1cDnyilFU=",
  channelSecret: "b52b3181a9007ecf69d13e619004d022",
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// simple reply function
const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({ type: 'text', text }))
    )
  ;
  //client.
};

const replySticker = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({
      "type": "sticker",
      "packageId": "11537",
      "stickerId": "52002768"
    })
    )
  );
  //client.
};

const replyImage = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({
      "type": "image",
      "originalContentUrl": "https://www.banbung.com/linechatbot/menu1.jpg",
      "previewImageUrl": "https://www.banbung.com/linechatbot/menu2.jpg" 
      })
    )
  );
  //client.
};

// event handler
function handleEvent(event) {
  
  switch (event.type) {
    case 'message':
      const message = event.message;
      switch (message.type) {
        case 'text':
          return handleText(message, event.replyToken);
        case 'image':
          return handleImage(message, event.replyToken);
        case 'video':
          return handleVideo(message, event.replyToken);
        case 'audio':
          return handleAudio(message, event.replyToken);
        case 'location':
          return handleLocation(message, event.replyToken);
        case 'sticker':
          return handleSticker(message, event.replyToken);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }

    case 'follow':
      return replyText(event.replyToken, 'Got followed event');

    case 'unfollow':
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case 'join':
      return replyText(event.replyToken, `Joined ${event.source.type}`);

    case 'leave':
      return console.log(`Left: ${JSON.stringify(event)}`);

    case 'postback':
      let data = event.postback.data;
      return replyText(event.replyToken, `Got postback: ${data}`);

    case 'beacon':
      const dm = `${Buffer.from(event.beacon.dm || '', 'hex').toString('utf8')}`;
      //return replyText(event.replyToken, `${event.beacon.type} beacon hwid : ${event.beacon.hwid} with device message = ${dm}`);
      return replyImage(event.replyToken, `${event.beacon.type} บีคอน : ${event.beacon.hwid} ==สกอบาร์ยินดีต้อนรับ==`);

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }

}

function handleText(message, replyToken) {
  return replyText(replyToken, message.text);
}

function handleImage(message, replyToken) {
  return replyText(replyToken, 'Got Image ได้รับภาพ');
}

function handleVideo(message, replyToken) {
  return replyText(replyToken, 'Got Video ได้รับวีดีโอ');
}

function handleAudio(message, replyToken) {
  return replyText(replyToken, 'Got Audio ได้รับเสียง');
}

function handleLocation(message, replyToken) {
  return replyText(replyToken, 'Got Location ได้รับที่ตั้ง');
}

function handleSticker(message, replyToken) {
  return replySticker(replyToken, 'Got Sticker ได้รับสติกเกอร์');
}
// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
