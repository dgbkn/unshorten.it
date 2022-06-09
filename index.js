const express = require("express");
const fs = require("fs");
const path = require("path");
const http = require("http");
const app = express();
var cors = require("cors");
var os = require("os");
const axios = require('axios');
const cheerio = require('cheerio');


app.use(cors());


app.get("/unshorten",async function (req, res) => {
  try {
    var url = req.query.url; // $_GET["id"]
  var page = await axios({
    url: "https://unshorten.it/",
    withCredentials: true
  });
  var $ = cheerio.load(page.data);
  var token = $("input[name='csrfmiddlewaretoken']")[0].attribs.value;
  var cookies = page.headers["set-cookie"].map(x => x.split(";")[0]).join(";");
  var lurl = await axios({
    url: "https://unshorten.it/main/get_long_url",
    method: "POST",
    headers: {
      'referer': 'https://unshorten.it/',
      'accept-encoding': 'application/json',
      'cookie': cookies
    },
    data: 'short-url=' + encodeURIComponent(url) + '&csrfmiddlewaretoken=' + token
  });
  res.send(lurl.data["long_url"]);
  } catch (e) {
    res.send(e);
  }
});

app.listen(process.env.PORT || 3000);

