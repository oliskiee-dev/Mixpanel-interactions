const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: "./announcement/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadAnnouncement = multer({ storage });

module.exports = uploadAnnouncement;
