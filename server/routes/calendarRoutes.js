const express = require("express");
const { 
    getAllCalendarEntries, 
    addCalendarEntry, 
    editCalendarEntry, 
    deleteCalendarEntry 
} = require("../controllers/calendarController");

const router = express.Router();

// Routes
router.get("/", getAllCalendarEntries);
router.post("/add", addCalendarEntry);
router.put("/edit/:id", editCalendarEntry);
router.delete("/delete/:id", deleteCalendarEntry);

module.exports = router;
