const mongoose = require('mongoose');

const Question = new mongoose.Schema({
  product_id: {type: Number, required: true},
  question_id: {type: Number},
  question_body: {type: String},
  question_date: {type: Date},
  asker_name: {type: String},
  email: {type: String},
  helpfulness: {type: Number},
  reported: {type: Boolean},
  answers: {type: Answer},
});

const Answer = new mongoose.Schema({
  body: {type: String},
  date: {type: Date},
  answerer_name: {type: String},
  email: {type: String},
  helpfulness: {type: Number},
  photos: [Photo],
});

const Photo = new mongoose.Schema({
  url: {type: String},
});