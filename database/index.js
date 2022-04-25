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

  // need to research more on pooling and connection
  pool.connect();

  const data = {
    product_id: productId
  }

  let questionsQuery = `SELECT id AS question_id, questions.body AS question_body, to_timestamp(date_written / 1000) AS question_date, asker_name, helpful AS question_helpfulness, reported
    FROM questions
    WHERE product_id = $1
    AND reported = 0
    LIMIT $2 OFFSET $3`

  pool.query(questionsQuery, [productId, count, offset], (err, res) => {
    if (err) {
      cb(err);
    } else {
      const questions = res.rows;

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const questionId = questions[i].question_id;

        let answersQuery = `SELECT id, body, to_timestamp(date_written / 1000) AS date, answerer_name, helpful AS helpfulness
          FROM answers
          WHERE question_id = $1
          AND reported = 0`

        pool.query(answersQuery, [questionId], (err, res) => {
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

                let photosQuery = `SELECT url FROM photos WHERE answer_id = $1`;

                pool.query(photosQuery, [answerId], (err, res) => {
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

  let answersQuery = `SELECT id AS answer_id, body, to_timestamp(date_written / 1000) AS date, answerer_name, helpful AS helpfulness
    FROM answers
    WHERE question_id = $1
    AND reported = 0
    LIMIT $2 OFFSET $3`;

  pool.query(answersQuery, [productId, count, offset], (err, res) => {
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

const createQuestion = (productId, body, name, email, cb) => {
  pool.connect();

  let date = Date.now();
  let insertQuery = `INSERT INTO questions (product_id, body, date_written, asker_name,asker_email, reported, helpful) VALUES ($1, $2, $3, $4, $5, 0, 0)`;

  pool.query(insertQuery, [productId, body, date, name, email], (err, res) => {
    if (err) {
      console.log(err.stack);
      cb(err);
    } else {
      cb(null, res);
    }
  });
}

const createAnswer = (questionId, body, name, email, photos, cb) => {
  pool.connect();

  let date = Date.now();
  let insertQuery = `INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email, reported, helpful) VALUES ($1, $2, $3, $4, $5, 0, 0) RETURNING id`;

  console.log('insertQuery:::', insertQuery);

  pool.query(insertQuery, [questionId, body, date, name, email], (err, res) => {
    if (err) {
      console.log(err.stack);
      cb(err);
    } else {
      let insertId = res.rows[0].id;
      for (let i = 0; i < photos.length; i++) {
        let currentUrl = photos[i];
        let insertQuery = `INSERT INTO photos (answer_id, url) VALUES ($1, $2)`;

        pool.query(insertQuery, [insertId, currentUrl], (err, res) => {
          if (err) {
            console.log(err.stack);
            cb(err);
          } else {
            if(i === photos.length - 1) {
              cb(null, res);
            }
          }
        });
      }
    }
  });
}

const updateQuestionHelpful = (questionId, cb) => {
  pool.connect();

  let updateQuery = `UPDATE questions SET helpful = helpful + 1
    WHERE id = $1`;

  pool.query(updateQuery, [questionId], (err, res) => {
    if (err) {
      console.log(err.stack);
      cb(err);
    } else {
      cb(null, res);
    }
  });
}

const updateQuestionReported = (questionId, cb) => {
  pool.connect();

  let updateQuery = `UPDATE questions SET reported = 1
    WHERE id = $1`;

  pool.query(updateQuery, [questionId], (err, res) => {
    if (err) {
      console.log(err.stack);
      cb(err);
    } else {
      cb(null, res);
    }
  });
}

const updateAnswerHelpful = (answerId, cb) => {
  pool.connect();

  let updateQuery = `UPDATE answers SET helpful = helpful + 1
    WHERE id = $1`;

  pool.query(updateQuery, [answerId], (err, res) => {
    if (err) {
      console.log(err.stack);
      cb(err);
    } else {
      cb(null, res);
    }
  })
}

const updateAnswerReported = (answerId, cb) => {
  pool.connect();

  let updateQuery = `UPDATE answers SET reported = 1
    WHERE id = $1`;

  pool.query(updateQuery, [answerId], (err, res) => {
    if (err) {
      console.log(err.stack);
      cb(err);
    } else {
      cb(null, res);
    }
  });
}

module.exports = {
  getAllQuestions: getAllQuestions,
  getAllAnswers: getAllAnswers,
  createQuestion: createQuestion,
  createAnswer: createAnswer,
  updateQuestionHelpful: updateQuestionHelpful,
  updateQuestionReported: updateQuestionReported,
  updateAnswerHelpful: updateAnswerHelpful,
  updateAnswerReported: updateAnswerReported,
}