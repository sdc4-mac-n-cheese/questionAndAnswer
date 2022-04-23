require('dotenv').config();
const { Client, Pool } = require('pg');

// const client = new Client({
//   user: process.env.USER,
//   host: process.env.HOST,
//   database: process.env.DATABASE,
//   password: process.env.PASSWORD,
//   port: process.env.PORT,
// });

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

const getAllQuestions = (productId, page = 1, count = 5, cb) => {
  const offset = (page - 1) * count;

  pool.connect();

  const data = {
    product_id: productId
  }

  let questionsQuery = `SELECT id AS question_id, questions.body AS question_body, to_timestamp(date_written / 1000) AS question_date, asker_name, helpful AS question_helpfulness, reported
    FROM questions
    WHERE product_id = ${productId}
    AND reported = 0
    LIMIT ${count} OFFSET ${offset}`

  pool.query(questionsQuery, (err, res) => {
    if (err) {
      cb(err);
    } else {
      const questions = res.rows;

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const questionId = questions[i].question_id;

        let answersQuery = `SELECT id AS id, body AS body, to_timestamp(date_written / 1000) AS date, answerer_name, helpful AS helpfulness
          FROM answers
          WHERE question_id = ${questionId}
          AND reported = 0`

        pool.query(answersQuery, (err, res) => {
          if (err) {
            cb(err);
          } else {
            const answers = res.rows;
            question.answers = {};

            for (let j = 0; j < answers.length; j++) {
              const answer = answers[j];
              const answerId = answers[j].id;

              if (answer.id) {
                question.answers[answerId] = answer;

                let photosQuery = `SELECT url FROM photos WHERE answer_id = ${answerId}`;

                pool.query(photosQuery, (err, res) => {
                  if (err) {
                    cb(err);
                  } else {
                    const photos = res.rows;
                    question.answers[answerId].photos = photos.map(photo => photo.url);

                    if (question.answers[answerId].photos === undefined) {
                      question.answers[answerId].photos = [];
                    }

                    if (i === questions.length - 1 && j === answers.length - 1) {
                      data.results = questions;
                      cb(null, data);
                      // client.end();
                    }
                  }
                });
              }
            }
          }
        });
      }
    }
  });
}

const getAllAnswers = (questionId, page = 1, count = 5, cb) => {
  const offset = (page - 1) * count;

  pool.connect();

  const data = {
    question: questionId,
    page: page,
    count: count,
  }

  let answersQuery = `SELECT id AS answer_id, body AS body, to_timestamp(date_written / 1000) AS date, answerer_name, helpful AS helpfulness
    FROM answers
    WHERE question_id = ${questionId}
    AND reported = 0
    LIMIT ${count} OFFSET ${offset}`;

  pool.query(answersQuery, (err, res) => {
    if (err) {
      cb(err);
    } else {
      const answers = res.rows;

      for (let j = 0; j < answers.length; j++) {
        const answer = answers[j];
        const answerId = answers[j]['answer_id'];

        let photosQuery = `SELECT url FROM photos WHERE answer_id = ${answerId}`;

        pool.query(photosQuery, (err, res) => {
          if (err) {
            cb(err);
          } else {
            const photos = res.rows;

            answer.photos = photos.map(photo => photo.url);

            if (answer.photos === undefined) {
              answer.photos = [];
            }

            if (j === answers.length - 1) {
              data.results = answers;
              cb(null, data);
              // client.end();
            }
          }
        });
      }
    }
  });

}

module.exports = {
  getAllQuestions: getAllQuestions,
  getAllAnswers: getAllAnswers,
}