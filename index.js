import express from "express";
import multer from "multer";
import axios from "axios";
import sizeOf from "image-size";
import sharp from "sharp";
import Busboy from "busboy";
import * as nodersa from 'node-rsa';
import * as Buffer from "buffer";

const img = multer({dest: "./img"});

const app = express();

app.use((req, res, next) => {
  res.setHeader('charset', 'utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,DELETE');
  next();
});

app.use(express.json());

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname);
  },
});

var upload = multer({ storage: storage });

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

  .all("/wordpress", async (req, res) => {
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

    const decrypted = new nodersa(
      req.files[key].data.toString()).decrypt(
        req.files[secret].data.toString()
        );

    res.send(decrypted);
})

  .post(
    "/decypher_rsa",
    upload.fields([
      {
        name: "secret",
        maxCount: 1,
      },
      {
        name: "key",
        maxCount: 1,
      },
    ]),
    (req, res, next) => {
      const files = req.files;

      if (!files) {
        const error = new Error("Please choose files");
        error.httpStatusCode = 400;
        return next(error);
      }

      const privateKey = fs.readFileSync("./uploads/key", "utf8");
      const decrypted = new nodersa(privateKey).decrypt(
        fs.readFileSync("./uploads/secret"),
        "utf8"
      );

      res.send(decrypted);
    }
  )

  .post("/decypher_bb", async (req, res) => {
    console.log(req.headers);
    let o = {key: '', secret: []};
    const boy = new Busboy({ headers: req.headers });
    boy.on('file', (fieldname, file) => file
      .on('data', data => {
             if (fieldname == 'key') {
                 o[fieldname] += data;
             } else {
                 o[fieldname].push(data);
             }
       }));
    boy.on('finish', () => {
      o.secret = Buffer.concat(o.secret);
      let result;
      try {
           result = dec(o.key, o.secret);
      } catch(e) {
           result = 'ERROR!';
      }
      res
      /* .set(CORS) */
      .send(String(result));
    });
    req.pipe(boy)
  })

  .all("/login", (req, res) => res.send("chiziwe"))

  .listen(process.env.PORT || 3000, () => {
    console.log("Привет, я работаю!");
  });