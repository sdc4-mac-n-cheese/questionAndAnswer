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

const getAllQuestions = (productId, cb) => {
  pool.connect();

  const data = {
    product_id: productId
  }

  let questionsQuery = `SELECT id AS question_id, questions.body AS question_body, to_timestamp(date_written) AS question_date, asker_name, helpful AS question_helpfulness, reported
    FROM questions
    WHERE product_id = ${productId}
    AND reported = 0`

  pool.query(questionsQuery, (err, res) => {
    if (err) {
      cb(err);
    } else {
      const questions = res.rows;

      for (let i = 0; i < questions.length; i++) {
        let questionId = questions[i].question_id;

        let answersQuery = `SELECT id AS id, body AS body, to_timestamp(date_written) AS date, answerer_name, helpful AS helpfulness
          FROM answers
          WHERE question_id = ${questionId}
          AND reported = 0`

        pool.query(answersQuery, (err, res) => {
          if (err) {
            cb(err);
          } else {
            const answers = res.rows;
            questions[i].answers = {};

            for (let j = 0; j < answers.length; j++) {
              let answerId = answers[j].id;

              if (answers[j].id) {
                questions[i].answers[answers[j].id] = answers[j];

                let photosQuery = `SELECT url FROM photos WHERE answer_id = ${answerId}`;

                pool.query(photosQuery, (err, res) => {
                  if (err) {
                    cb(err);
                  } else {
                    const photos = res.rows;
                    questions[i].answers[answers[j].id].photos = photos.map(photo => photo.url);

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

module.exports.getAllQuestions = getAllQuestions;