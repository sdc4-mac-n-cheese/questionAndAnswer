const { pool } = require('../database/index.js');

const getAllQuestions = async (productId, page = 1, count = 5, cb) => {

  const offset = (page - 1) * count;

  const data = {
    productId: productId,
    results: [],
  }

  let questionsQuery = `SELECT id AS question_id, questions.body AS question_body, to_timestamp(date_written / 1000) AS question_date, asker_name, helpful AS question_helpfulness, CASE WHEN reported = 0 THEN 'false' END AS reported
      FROM questions
      WHERE product_id = $1
      AND reported = 0
      LIMIT $2 OFFSET $3`;

  await pool.query(questionsQuery, [productId, count, offset])
    .then(async (res) => {

      const questions = res.rows;

      if (questions.length !== 0) {
        for (let i = 0; i < questions.length; i++) {
          const question = questions[i];
          const questionId = questions[i].question_id;

          let answersQuery = `SELECT id, body, to_timestamp(date_written / 1000) AS date, answerer_name, helpful AS helpfulness
            FROM answers
            WHERE question_id = $1
            AND reported = 0`;

          await pool.query(answersQuery, [questionId])
            .then(async (res) => {

              const answers = res.rows;
              question.answers = {};

              if (answers.length !== 0) {

                for (let j = 0; j < answers.length; j++) {
                  const answer = answers[j];
                  const answerId = answers[j].id;

                  question.answers[answerId] = answer;

                  let photosQuery = `SELECT url FROM photos WHERE answer_id = $1`;

                  await pool.query(photosQuery, [answerId])
                    .then((res) => {

                      const photos = res.rows;
                      question.answers[answerId].photos = photos.map(photo => photo.url);

                      if (question.answers[answerId].photos === undefined) {
                        question.answers[answerId].photos = [];
                      }

                      if (i === questions.length - 1 && j === answers.length - 1) {
                        data.results = questions;
                        cb(null, data);
                      }
                    })
                    .catch((err) => {
                      console.log(err.stack);
                      cb(err);
                    });
                }
              } else {
                if (i === questions.length - 1) {
                  data.results = questions;
                  cb(null, data);
                }
              }
            })
            .catch((err) => {
              console.log(err.stack);
              cb(err);
            });
        }
      } else {
        cb(null, data);
      }
    })
    .catch((err) => {
      console.log(err.stack);
      cb(err);
    })
}

const getAllAnswers = async (questionId, page = 1, count = 5, cb) => {
  const offset = (page - 1) * count;

  const data = {
    question: questionId,
    page: page,
    count: count,
    results: [],
  }

  let answersQuery = `SELECT id AS answer_id, body, to_timestamp(date_written / 1000) AS date, answerer_name, helpful AS helpfulness
    FROM answers
    WHERE question_id = $1
    AND reported = 0
    LIMIT $2 OFFSET $3`;

  await pool.query(answersQuery, [questionId, count, offset])
    .then(async (res) => {
      const answers = res.rows;

      if (answers.length !== 0) {
        for (let i = 0; i < answers.length; i++) {
          const answer = answers[i];
          const answerId = answers[i]['answer_id'];

          let photosQuery = `SELECT url FROM photos WHERE answer_id = $1`;

          await pool.query(photosQuery, [answerId])
            .then((res) => {
              const photos = res.rows;

              answer.photos = photos.map(photo => photo.url);

              if (answer.photos === undefined) {
                answer.photos = [];
              }

              if (i === answers.length - 1) {
                data.results = answers;
                cb(null, data);
              }

            })
            .catch((err) => {
              console.log(err.stack);
              cb(err);
            })
        }
      } else {
        cb(null, data);
      }
    })
    .catch((err) => {
      console.log(err.stack);
      cb(err);
    })
}

const createQuestion = (productId, body, name, email, cb) => {

  let date = Date.now();
  let insertQuery = `INSERT INTO questions (product_id, body, date_written, asker_name, asker_email, reported, helpful) VALUES ($1, $2, $3, $4, $5, 0, 0)`;

  pool.query(insertQuery, [productId, body, date, name, email])
    .then((res) => {
      cb(null, res);
    })
    .catch((err) => {
      console.log(err.stack);
      cb(err);
    })
}

const createAnswer = (questionId, body, name, email, photos, cb) => {
  let date = Date.now();
  let insertQuery = `INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email, reported, helpful) VALUES ($1, $2, $3, $4, $5, 0, 0) RETURNING id`;

  pool.query(insertQuery, [questionId, body, date, name, email])
    .then(async (res) => {
      let insertId = res.rows[0].id;
      for (let i = 0; i < photos.length; i++) {
        let currentUrl = photos[i];
        let insertQuery = `INSERT INTO photos (answer_id, url) VALUES ($1, $2)`;

        await pool.query(insertQuery, [insertId, currentUrl])
          .then((res) => {
            if (i === photos.length - 1) {
              cb(null, res);
            }
          })
          .catch((err) => {
            console.log(err.stack);
            cb(err);
          });
      }
    })
    .catch((err) => {
      console.log(err.stack);
      cb(err);
    })
}

const updateQuestionHelpful = (questionId, cb) => {

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