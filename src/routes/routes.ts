import express from 'express';
import Url from '../models/url';
import url from 'url';
import shortid from 'shortid';
import moment from 'moment';

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({
  extended: true
}));
router.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', process.env.UI);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');

  next();
});

router.get('/home', (req, res) => {
  res.send('Hello');
});

//generate short url out of original url
router.post('/generate-short-url', (req, res) => {

  Url.findOne({ 'url_address': req.body.url }).then(result => {
    if (result) {
      res.json({
        shortUrl: `${process.env.HOST}/url/${result.shorten_url_code}`
      });
    } else {
      let urlObject = {
        domain: url.parse(req.body.url).hostname,
        url_address: req.body.url,
        date_added: new Date(),
        shorten_url_code: shortid.generate()
      };

      let urlInstance = new Url(urlObject);
      urlInstance.save((err) => {
        if (err) {
          console.log(err);
          res.send(err);
        }
      });
      res.json({
        shortUrl: `${process.env.HOST}/url/${urlObject.shorten_url_code}`
      });
    }
  })
});


//accept shortened url and redirect to true url
router.get('/url/:shortUrlCode', async (req, res) => {
  Url.findOne({ 'shorten_url_code': req.params.shortUrlCode }).then((result) => {
    res.redirect(result.url_address);
  }).catch(err => res.send(err));
});

//accept short url address and return original address
router.get('/extract-url/:shortUrlCode', (req, res) => {
  Url.findOne({ 'shorten_url_code': req.params.shortUrlCode }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      console.log(result.url_address);

      res.json({
        'url_address': result.url_address
      });
    }
  });
});

//popular domains
router.get('/popular-domains', (req, res) => {
  const oneDayAgo = moment().add(-1, 'days');
  Url.aggregate([
    { '$match': { 'date_added': { '$gte': oneDayAgo.toDate() } } },
    { '$group': { '_id': '$domain', 'popularity': { '$sum': 1 } } },
    { '$sort': { popularity: -1 } }]
  ).then(result => {
    console.log(result);
    res.json({
      'url': result
    });
  }).catch(err => res.send(err))
});

export = router;