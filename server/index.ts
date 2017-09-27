import "zone.js/dist/zone-node";
import * as functions from "firebase-functions";
import * as express from "express";
import * as path from "path";
import * as fs from "fs";
import {enableProdMode} from "@angular/core";
import {renderModuleFactory} from "@angular/platform-server";


const AppServerModuleNgFactory = require("./dist-server/main.bundle");
enableProdMode();
const index = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8').toString();
let app = express();
app.get('**', function(req, res) {
    renderModuleFactory(AppServerModuleNgFactory, {
        url: req.path,
        document: index
    }).then(html => {
        res.set("Cache-Control","public,x-maxage=600,s-maxage=1200");
        res.status(200).send(html);
    });
});
export let ssr = functions.https.onRequest(app);