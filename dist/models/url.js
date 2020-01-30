"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const UrlSchema = mongoose_1.default.Schema({
    domain: String,
    url_address: String,
    date_added: Date,
    shorten_url_code: String
});
module.exports = mongoose_1.default.model('Url', UrlSchema);
//# sourceMappingURL=url.js.map