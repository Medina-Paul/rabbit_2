const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

require("dotenv").config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log(req.file);
    console.log(req.body);
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (error) {
            console.log("Cloudinary error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        });

        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };


    const result = await streamUpload(req.file.buffer);
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Cloudinary error" });
  }
});

module.exports = router;
