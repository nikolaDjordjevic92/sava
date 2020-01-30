"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes/routes"));
class App {
    constructor() {
        this.express = express_1.default();
        this.express.use('/', routes_1.default);
    }
}
exports.default = new App().express;
//# sourceMappingURL=App.js.map