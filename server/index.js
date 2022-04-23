const express = require('express');
const axios = require('axios');
const { getAllQuestions, getAllAnswers } = require('../database/index.js');

const app = express();

const PORT = 3071;

app.use(express.json());

app.get('/qa/questions', (req, res) => {
  const productId = req.query.product_id;
  const { page, count } = req.query;

  getAllQuestions(productId, page, count, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else (
      res.send(results)
    );
  });
});

// this is my anwers route for a given questionId
app.get('/qa/questions/:question_id/answers', (req, res) => {
  const questionId = req.params.question_id;
  const { page, count } = req.query;

  getAllAnswers(questionId, page, count, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else (
      res.send(results)
    );
  });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
