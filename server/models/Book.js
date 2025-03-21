const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  availability: {
    Monday: [{ start: String, end: String }],
    Tuesday: [{ start: String, end: String }],
    Wednesday: [{ start: String, end: String }],
    Thursday: [{ start: String, end: String }],
    Friday: [{ start: String, end: String }],
    Saturday: [{ start: String, end: String }],
    Sunday: [{ start: String, end: String }],
  },
});

const bookModel = mongoose.model("book", bookSchema);

module.exports = bookModel;
