const express = require("express");
const { 
    getAllCalendarEntries, 
    addCalendarEntry, 
    editCalendarEntry, 
    deleteCalendarEntry,
    deletePreviousYearEntries
} = require("../controllers/calendarController");

const router = express.Router();

// Routes
router.get("/", getAllCalendarEntries);
router.post("/add", addCalendarEntry);
router.put("/edit/:id", editCalendarEntry);
router.delete("/delete/:id", deleteCalendarEntry);
router.delete("/delete-previous-year", deletePreviousYearEntries); // New route to delete previous year

module.exports = router;
