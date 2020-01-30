import mongoose from 'mongoose';

const UrlSchema = mongoose.Schema({
  domain: String,
  url_address: String,
  date_added: Date,
  shorten_url_code: String
});

export = mongoose.model('Url', UrlSchema);