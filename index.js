import express from "express";
import multer from "multer";
import axios from "axios";
import sizeOf from "image-size";
import sharp from "sharp";
import Busboy from "busboy";
import privateDecrypt from "crypto";
import * as NodeRSA from 'node-rsa';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,DELETE,PUT,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Access-Control-Allow-Headers'
};

const app = express();

const img = multer({dest: "./img"});

app

  .all("/makeimage", async (req, res) => {
    const width = Number(req.query.width);
    const height = Number(req.query.height);

    const path = "./img/img1.png";
    const pathRes = "./img/result.png";

    sharp(path)
      .resize(width, height)
      .toFile(pathRes, () => {res.download(pathRes)});
  })

  .all("/wordpress/", async (req, res) => {
    const content = req.query.content;
    const URL1 = 'https://wordpress.kodaktor.ru/wp-json/jwt-auth/v1/token';
    const URL2 = 'https://wordpress.kodaktor.ru/wp-json/wp/v2/posts/';

    const response = await axios
        .post(
            URL1,
            {
                username: "gossjsstudent2017",
                password: "|||123|||456"
            }
            );
    const token = response.data.token;
    const wp_response = await axios
        .post
            (URL2,
            {
                title: "chiziwe",
                content,
                status: "publish"
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            });
    res.send(wp_response.data.id);
  })

  .post("/size2json", img.single("image"), async (req, res) => {
    const path = req.file.path;
    sizeOf(path, function (err, dimensions) {
        res.send(
            {
                width: dimensions.width,
                height: dimensions.height
            });
    });
  })

  .post('/decypher', (req, res) => {
    const keyBuffer = req.files.key.data;
    const secretBuffer = req.files.secret.data;

    let privateKey = keyBuffer.toString();
    const decrypted = new NodeRSA(privateKey).decrypt(secretBuffer);

    res.send(decrypted);
  })

  .post("/decypher2", async (req, res) => {
    console.log(req.headers);
    let o = {};
    const boy = new Busboy({headers: req.headers});
    boy.on('file', (fieldName, file) => file
        .on('data', data => (o[fieldName] = data))
        .on('end', () => console.log('Файл [' + fieldName + ']')));
    boy.on('finish', () => {
        let result;
        try {
            result = privateDecrypt(o.key, o.secret);
        } catch(e) {
            result = privateDecrypt(o.key, o.secret);;
        }
        res
        .set(CORS)
        .send(String(result));
    });
  req.pipe(boy);
})

  .all("/login", (req, res) => res.send("chiziwe"))

  .listen(process.env.PORT || 3000, () => {
    console.log("Привет, я работаю!");
  });