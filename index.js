import express from "express";
import multer from "multer";
import axios from "axios";
import sizeOf from "image-size";
import sharp from "sharp";

const app = express();

const img = multer({dest: "./img"});

app

  .get("/makeimage", (req, res) => {
    const width = parseInt(req.query.width);
    const height = parseInt(req.query.height);
    const path = "./img/result.png";
    sharp("./img/img1.jpeg")
      .resize(width, height)
      .toFile(path, () => {res.download(path)});
  })

  .get("/wordpress/", async (req, res) => {
    const content = req.query.content;
    const response = await axios
        .post(
            "https://wordpress.kodaktor.ru/wp-json/jwt-auth/v1/token",
            {
                username: "gossjsstudent2017",
                password: "|||123|||456"
            }
            );
    const token = response.data.token;
    const wp_response = await axios
        .post
            (`https://wordpress.kodaktor.ru/wp-json/wp/v2/posts/`,
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

  .all("/login", (req, res) => res.send("chiziwe"))

  .listen(process.env.PORT || 3000, () => {
    console.log("Привет, я работаю!");
  });