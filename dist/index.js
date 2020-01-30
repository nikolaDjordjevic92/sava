"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __importDefault(require("./App"));
const mongoose_1 = __importDefault(require("mongoose"));
const port = 3457;
let mongoDB = 'mongodb://localhost:27017/sava';
mongoose_1.default.connect(mongoDB, { useNewUrlParser: true }).then(() => {
    console.log('Connected to database mongodb');
}).catch((err) => console.log(err));
App_1.default.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }
    return console.log('server is running on ' + port);
});
//# sourceMappingURL=index.js.map