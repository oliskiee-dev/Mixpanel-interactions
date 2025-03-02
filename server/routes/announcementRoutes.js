const express = require("express");
const router = express.Router();
const uploadAnnouncement = require("../middleware/uploadAnnouncement");
const {
    getAllAnnouncements,
    addAnnouncement,
    editAnnouncement,
    deleteAnnouncement
} = require("../controllers/announcementController");

// Routes
router.get("/", getAllAnnouncements);
router.post("/add", uploadAnnouncement.single("image"), addAnnouncement);
router.put("/edit/:id", uploadAnnouncement.single("image"), editAnnouncement);
router.delete("/delete/:id", deleteAnnouncement);

module.exports = router;
