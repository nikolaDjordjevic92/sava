"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const url_1 = __importDefault(require("../models/url"));
const url_2 = __importDefault(require("url"));
const shortid_1 = __importDefault(require("shortid"));
const moment_1 = __importDefault(require("moment"));
const router = express_1.default.Router();
router.use(express_1.default.json());
router.use(express_1.default.urlencoded({
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
    url_1.default.findOne({ 'url_address': req.body.url }).then(result => {
        if (result) {
            res.json({
                shortUrl: `${process.env.HOST}/url/${result.shorten_url_code}`
            });
        }
        else {
            let urlObject = {
                domain: url_2.default.parse(req.body.url).hostname,
                url_address: req.body.url,
                date_added: new Date(),
                shorten_url_code: shortid_1.default.generate()
            };
            let urlInstance = new url_1.default(urlObject);
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
    });
});
//accept shortened url and redirect to true url
router.get('/url/:shortUrlCode', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    url_1.default.findOne({ 'shorten_url_code': req.params.shortUrlCode }).then((result) => {
        res.redirect(result.url_address);
    }).catch(err => res.send(err));
}));
//accept short url address and return original address
router.get('/extract-url/:shortUrlCode', (req, res) => {
    url_1.default.findOne({ 'shorten_url_code': req.params.shortUrlCode }, (err, result) => {
        if (err) {
            res.send(err);
        }
        else {
            console.log(result.url_address);
            res.json({
                'url_address': result.url_address
            });
        }
    });
});
//popular domains
router.get('/popular-domains', (req, res) => {
    const oneDayAgo = moment_1.default().add(-1, 'days');
    url_1.default.aggregate([
        { '$match': { 'date_added': { '$gte': oneDayAgo.toDate() } } },
        { '$group': { '_id': '$domain', 'popularity': { '$sum': 1 } } },
        { '$sort': { popularity: -1 } }
    ]).then(result => {
        console.log(result);
        res.json({
            'url': result
        });
    }).catch(err => res.send(err));
});
module.exports = router;
//# sourceMappingURL=routes.js.map