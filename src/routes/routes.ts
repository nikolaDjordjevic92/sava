import express from 'express';
import Url from '../models/url';
import url from 'url';
import shortid from 'shortid';
import moment from 'moment';

import bodyParser from 'body-parser';

// const app = express();


const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({
  extended: true
}));

router.get('/home',(req,res) => {
  res.send('Cao, sta ima?');
});

//generate short url out of original url
router.post('/generate-short-url',(req,res) => {
  let urlObject = {
    domain: url.parse(req.body.url).hostname,
    url_address: req.body.url,
    date_added: new Date(),
    shorten_url_code: shortid.generate()
  };

  let urlInstance = new Url(urlObject);
  urlInstance.save((err)=>{
    if(err) {
      console.log(err);
      res.send(err);
    } 
  });
  res.json({
    "message":"Success",
    "shortUrl":`http://localhost:3457/${urlObject.shorten_url_code}`
  });
});


//accept shortened url and redirect to true url
router.get('/url/:shortUrlCode', async (req, res) =>{
  Url.findOne({'shorten_url_code':req.params.shortUrlCode},(err,result) =>{
    if(err) {
      res.send(err);
    } else {
      res.redirect(result.url_address);
    }
  });
});

//accept short url address and return original address
router.get('/extract-url/:shortUrlCode',(req,res) => {
  Url.findOne({'shorten_url_code':req.params.shortUrlCode},(err,result) =>{
    if(err) {
      res.send(err);
    } else {
      res.json({
        'url': result.url_address
      });
    }
  });
});

router.get('/popular-domains', (req, res) => {
  const oneDayAgo = moment().add(-1, 'days');
  Url.aggregate([{'$match':{'date_added':{'$gte': oneDayAgo.toDate()}}},
                 {'$group' :{'_id':'$domain', 'count': {'$sum':1}}},
                 {'$sort':{"count":-1}}], (err,result) => {
                   console.log(result);
    if(err) {
      res.send(err);
    } else {
      res.json({
        'url': result
      });
    }
  })
});

export = router;