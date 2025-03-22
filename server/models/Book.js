const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  availability: {
    Monday: [String],
    Tuesday: [String],
    Wednesday: [String],
    Thursday: [String],
    Friday: [String],
    Saturday: [String],
    Sunday: [String],
  },
});

const bookModel = mongoose.model("book", bookSchema);

module.exports = bookModel;

