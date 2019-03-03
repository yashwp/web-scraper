const express = require('express');
const request = require('request');
const fs = require('fs');
const cheerio = require('cheerio');
const app = express();


app.get('/scrape', async (req, res, next) => {
  const URL = 'https://dev.to/dfockler/using-custom-properties-to-supercharge-your-css-1037';
  let article = {
    author: '',
    title: '',
    body: ''
  };

  request(URL, (err, res, html) => {
    if (err) {
      res.status(400).send(err);
    }

    let $ = cheerio.load(html);

    article.author = $('header.title h3 span[itemprop="author"] .author span').text().trim();
    article.title = $('header.title h1[itemprop="name headline"]').text().trim();
    article.body = $('#article-body').text().trim();

    fs.writeFile(`${article.title}.json`, JSON.stringify(article, null, 2), (err) => {
      if (err) {
        res.statusCode(400).send(err);
      }
      console.log('File created successfully');
    });
  });

  res.send('Check yourconsole');
});


app.listen(3400);