import express from "express";
import multer from "multer";
import sizeOf from "image-size";
import sharp from "sharp";
// import fs from "fs";
import axios from "axios";

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

  .get("/wordpress/", async (req, res, next) => {
    const content = req.query.content;
    const response = await axios.post(
      "https://wordpress.kodaktor.ru/wp-json/jwt-auth/v1/token",
      { username: "gossjsstudent2017", password: "|||123|||456" }
    );
    const token = response.data.token;
    const WPresponse = await axios.post(
      `https://wordpress.kodaktor.ru/wp-json/wp/v2/posts/`,

      { title: "chiziwe", content, status: "publish" },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.send(WPresponse.data.id + "");
  })

  .post("/size2json", img.single("image"), async (req, res) => {
    const tempPath = req.file.path;
    sizeOf(tempPath, function (err, dimensions) {
        res.send({width: dimensions.width, height: dimensions.height});
    });
  })

  .all("/login", (r) => r.res.send("chiziwe"))

  .listen(process.env.PORT || 3000, () => {
    console.log("Привет, я работаю!");
  });