const express = require('express');
const multer = require('multer');
const Sticker = require('../models/stickers');
const { upload, saveFile } = require('../middleware/upload');
const router = express.Router();

// Get all Stickers
router.get('/stickers', async (req, res) => {
  try {
    console.log("GET /stickers");
    const stickers = await Sticker.find().sort({ "image.dateCreated": -1 });
    res.json(stickers);
  } catch (error) {
    console.error("GET /stickers error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get a sticker by ID
router.get('/stickers/:id', async (req, res) => {
  try {
    console.log("GET /stickers/:id", req.params.id);
    const sticker = await Sticker.findById(req.params.id);
    if (!sticker) return res.status(404).json({ message: 'Sticker not found' });
    res.json(sticker);
  } catch (error) {
    console.error("GET /stickers/:id error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// POST stickers
router.post('/stickers', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileMetaData = saveFile(req.file);

    const sticker = new Sticker({
      image: {
        size: fileMetaData.size,
        name: fileMetaData.filename,
        url: fileMetaData.url,
        dateCreated: new Date(),
      },
      description: req.body.description,
      amount: req.body.amount,
      locationSource: req.body.locationSource,
      designerName: req.body.designerName,
      stickerPrinter: req.body.stickerPrinter,
      rating: {
        design: req.body.rating.design,
        quality: req.body.rating.quality
      },
    });

    const newSticker = await sticker.save();
    res.status(201).json(newSticker); 
  } catch (error) {
    console.error("POST /stickers error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
