// Schema Modification - models/questionPaper.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    questionNumber: { type: Number, required: true },
    subject: { type: String, enum: ['Physics', 'Chemistry', 'Mathematics'], required: true },
    description: { type: String, required: true, unique: true },
    image: { type: String}, // Store image data as buffer
    correctAns: { type: String, required: true }
});

module.exports = mongoose.model('Question', questionSchema);
