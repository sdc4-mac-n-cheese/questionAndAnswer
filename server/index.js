const express = require('express');
const axios = require('axios');
const { getAllQuestions, getAllAnswers, createQuestion, createAnswer, updateQuestionHelpful, updateQuestionReported, updateAnswerHelpful, updateAnswerReported } = require('../database/index.js');

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

app.post('/qa/questions', (req, res) => {
  // should be type checking email address
  const { body, name, email } = req.body;
  const productId  = req.body.product_id;

  createQuestion(productId, body, name, email, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(response);
    }
  });
});

app.post('/qa/questions/:question_id/answers', (req, res) => {
  // should be type checking email address
  const { body, name, email, photos } = req.body;
  const questionId = req.params.question_id;

  createAnswer(questionId, body, name, email, photos, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(response);
    }
  })
});

app.put('/qa/questions/:question_id/helpful', (req, res) => {

  const questionId = req.params.question_id;

  updateQuestionHelpful(questionId, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // this isn't logging in postman, not sure why
      res.status(204).send('helpful update successful');
    }
  });
});

app.put('/qa/questions/:question_id/report', (req, res) => {

  const questionId = req.params.question_id;

  updateQuestionReported(questionId, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(204).send(response);
    }
  });
});

app.put('/qa/answers/:answer_id/helpful', (req, res) => {

  const answerId = req.params.answer_id;

  updateAnswerHelpful(answerId, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(204).send(response);
    }
  });
});

app.put('/qa/answers/:answer_id/report', (req, res) => {

  const answerId = req.params.answer_id;

  updateAnswerReported(answerId, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(204).send(response);
    }
  });
})



app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
