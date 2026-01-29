const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "../public/kepek");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

router.post("/:ISBN", upload.single("file"), async (req, res) => {
  try {
    const ISBN = req.params.ISBN;

    if (!req.file) {
      return res.status(400).json({ error: "Nincs feltöltött fájl!" });
    }

    const outputPath = path.join(UPLOAD_DIR, `${ISBN}.jpg`);

    await sharp(req.file.buffer)
      .resize(500, 500, { fit: "contain", background: "white" })
      .jpeg({ quality: 90 })
      .toFile(outputPath);

    res.json({
      message: "Kép sikeresen feltöltve!",
      file: `${ISBN}.jpg`,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Hiba történt a mentés során." });
  }
});

module.exports = router;
