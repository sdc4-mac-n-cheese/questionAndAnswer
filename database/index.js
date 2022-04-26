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
  max: 100,
});


const getAllQuestions3 = (productId, page, count, cb) => {
  page = page || 1;
  count = count || 5;

  const offset = (page - 1) * count;

  let answerId = 10;

  let query = `SELECT json_build_object(
    'question_id', (SELECT (id) FROM questions WHERE id = 34),
    'question_body', (SELECT (body) FROM questions WHERE id = 34),
    'question_date', (SELECT (to_timestamp(date_written / 1000)) FROM questions WHERE id = 34),
    'asker_name', (SELECT (asker_name) FROM questions WHERE id = 34),
    'question_helpfulness', (SELECT (helpful) FROM questions WHERE id = 34),
    'reported', (SELECT (reported) FROM questions WHERE id = 34),
    'answers', (SELECT json_build_object(
    'body', (SELECT (body) FROM answers WHERE id = $1),
    'date', (SELECT (to_timestamp(date_written / 1000)) FROM answers WHERE id = $1),
    'answer_name', (SELECT (answerer_name) FROM answers WHERE id = $1),
    'helpfulness', (SELECT (helpful) FROM answers WHERE id = $1),
    'photos', (SELECT array_agg(url) AS photos
     FROM photos
     WHERE answer_id = $1)) AS placeholderid))`;

  pool.query(query, [answerId])
    .then(res => {
      console.log(JSON.stringify(res.rows, null, 4));
    })
    .catch(err => {
      console.log(err.stack);
    })
}
// getAllQuestions3();


const getAllQuestions2 = (productId, page, count, cb) => {
  page = page || 1;
  count = count || 5;

  const offset = (page - 1) * count;

  console.log('page::', page);
  console.log('count::', count);

  const data = {
    productId: productId,
  }

  console.log('offset::', offset);

  let questionsQuery = `SELECT id AS question_id, questions.body AS question_body, to_timestamp(date_written / 1000) AS question_date, asker_name, helpful AS question_helpfulness, CASE WHEN reported = 0 THEN 'false' END AS reported
      FROM questions
      WHERE product_id = $1
      AND reported = 0
      LIMIT $2 OFFSET $3`;

  pool.query(questionsQuery, [productId, count, offset])
    .then((res) => {
      const questions = res.rows;

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const questionId = questions[i]. question_id;

        let answersQuery = `SELECT id, body, to_timestamp(date_written / 1000) AS date, answerer_name, helpful AS helpfulness
            FROM answers
            WHERE question_id = $1
            AND reported = 0`;

        pool.query(answersQuery, [questionId])
        .then((res) => {
          const answers = res.rows;
          question.answers = {};

          for (let j = 0; j < answers.length; j++) {
            const answer = answers[j];
            const answerId = answers[j].id;

            console.log('answerId:::', answerId);

            question.answers[answerId] = answer;

            let photosQuery = `SELECT url FROM photos WHERE answer_id = $1`;

            pool.query(photosQuery, [answerId])
              .then((res) => {
                const photos = res.rows;
                question.answers[answerId].photos = photos.map(photo => photo.url);
                console.log(':::line 74:::');

                // need to fix missing photos array
                if (question.answers[answerId].photos === undefined) {
                  question.answers[answerId].photos = [];
                }

                if (i === questions.length - 1 && j === answers.length - 1) {
                  console.log(':::line 76:::');
                  data.results = questions;
                  cb(null, data);
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
        });
      }
    })
    .catch((err) => {
      console.log(err.stack);
      cb(err);
    })
}

const getAllQuestions = (productId, page = 1, count = 5, cb) => {
  console.log(':::get all questions invoked:::');
  const offset = (page - 1) * count;

  const data = {
    product_id: productId
  }

  let questionsQuery = `SELECT id AS question_id, questions.body AS question_body, to_timestamp(date_written / 1000) AS question_date, asker_name, helpful AS question_helpfulness, CASE WHEN reported = 0 THEN 'false' END AS reported
      FROM questions
      WHERE product_id = $1
      AND reported = 0
      LIMIT $2 OFFSET $3`

  pool.query(questionsQuery, [productId, count, offset], (err, res) => {
    if (err) {
      cb(err);
    } else {
      console.log(':::questionsQuery cb invoked:::');
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
            console.log(':::answersQuery cb invoked:::');
            const answers = res.rows;
            question.answers = {};

            for (let j = 0; j < answers.length; j++) {
              const answer = answers[j];
              const answerId = answers[j].id;

              if (answer.id) {
                question.answers[answerId] = answer;

                let photosQuery = `SELECT url FROM photos WHERE answer_id = $1`;

                pool.query(photosQuery, [answerId], (err, res) => {
                  console.log(':::photosQuery cb invoked:::');
                  if (err) {
                    cb(err);
                  } else {
                    const photos = res.rows;
                    question.answers[answerId].photos = photos.map(photo => photo.url);
                    console.log('photos:::', photos);

                    if (question.answers[answerId].photos === undefined) {
                      question.answers[answerId].photos = [];
                    }

                    console.log('i:::', i);
                    console.log('questions.length:::', questions.length);

                    console.log('j:::', j);
                    console.log('answers.length:::', answers.length);

                    if (i === questions.length - 1 && j === answers.length - 1) {
                      console.log('data:::', data);
                      data.results = questions;
                      cb(null, data);
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
            if (i === photos.length - 1) {
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
  getAllQuestions2: getAllQuestions2,
  getAllAnswers: getAllAnswers,
  createQuestion: createQuestion,
  createAnswer: createAnswer,
  updateQuestionHelpful: updateQuestionHelpful,
  updateQuestionReported: updateQuestionReported,
  updateAnswerHelpful: updateAnswerHelpful,
  updateAnswerReported: updateAnswerReported,
}