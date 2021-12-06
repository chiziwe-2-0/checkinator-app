import express from "express";
import multer from "multer";
// import sizeOf from "image-size";
import sharp from "sharp";
/** import fs from "fs";
import axios from "axios";
import crypto from "crypto";
*/

const app = express();

const img = multer({
  dest: "./img",
});

app

  .get("/makeimage", (r) => {
    const width = parseInt(r.query.width);
    const height = parseInt(r.query.height);
    sharp("./img/img1.jpeg")
      .resize(width, height)
      .toFile("./img/result.png", (err, info) => {
        r.res.download("./img/result.png");
      });
  })

  .all("/login", (r) => r.res.send("chiziwe"))

  .listen(process.env.PORT || 3000, () => {
    console.log("Привет, я работаю!");
  });