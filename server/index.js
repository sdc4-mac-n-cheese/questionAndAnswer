const express = require('express');
const axios = require('axios');
const { getAllQuestions } = require('../database/index.js');

const app = express();

const PORT = 3071;

app.use(express.json());

app.get('/qa/questions', (req, res) => {
  const productId = req.query.product_id;

  getAllQuestions(productId, (err, results) => {
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

// getAllQuestions(1, (err, results) => {
//   console.log('err:::', err);
//   console.log('results:::', JSON.stringify(results, null, 4));
// });