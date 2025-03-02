const express = require("express");
const router = express.Router();
const homepageController = require("../controllers/homepageController");
const uploadHomepage = require("../middleware/uploadHomepage"); // Make sure you have this middleware for file uploads

router.post("/upload-image", uploadHomepage.single("image"), homepageController.uploadImage);
router.delete("/delete-image/:filename", homepageController.deleteImage);
router.get("/images", homepageController.getAllImages);

module.exports = router;
