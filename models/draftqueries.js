`
  SELECT array(
  SELECT jsonb_build_object(
      'product', product_id,
      'rating', rating,
      'summary', summary,
      'recommend', recommend,
      'response', response,
      'body', body,
      'date', date,
      'reviewer_name', reviewer_name,
      'helpfulness', helpfulness,
      'photos', (
        SELECT ARRAY(
        SELECT json_build_object(
          'id', review_photos.id,
          'url', review_photos.url
        ))
      ))
    FROM review
    INNER JOIN review_photos
    ON review_photos.id = review.id
    WHERE product_id = $3
    ORDER BY date DESC
    LIMIT $1 OFFSET $2
    ) as results`

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


// const getAllQuestions = async (productId, page = 1, count = 5, cb) => {
//   console.log(':::get all questions invoked:::');

//   const offset = (page - 1) * count;

//   const data = {
//     product_id: productId
//   }

//   let questionsQuery = `SELECT id AS question_id, questions.body AS question_body, to_timestamp(date_written / 1000) AS question_date, asker_name, helpful AS question_helpfulness, CASE WHEN reported = 0 THEN 'false' END AS reported
//       FROM questions
//       WHERE product_id = $1
//       AND reported = 0
//       LIMIT $2 OFFSET $3`

//   await pool.query(questionsQuery, [productId, count, offset], async (err, res) => {
//     if (err) {
//       cb(err);
//     } else {
//       console.log(':::questionsQuery cb invoked:::');
//       const questions = res.rows;

//       console.log('questions.length:::', questions.length);

//       for (let i = 0; i < questions.length; i++) {
//         const question = questions[i];
//         const questionId = questions[i].question_id;

//         let answersQuery = `SELECT id, body, to_timestamp(date_written / 1000) AS date, answerer_name, helpful AS helpfulness
//             FROM answers
//             WHERE question_id = $1
//             AND reported = 0`

//         await pool.query(answersQuery, [questionId], async (err, res) => {
//           if (err) {
//             cb(err);
//           } else {

//             console.log(':::answersQuery cb invoked:::');

//             const answers = res.rows;
//             question.answers = {};

//             for (let j = 0; j < answers.length; j++) {
//               const answer = answers[j];
//               const answerId = answers[j].id;

//               if (answer.id) {
//                 question.answers[answerId] = answer;

//                 console.log('answers.length:::', answers.length);

//                 let photosQuery = `SELECT url FROM photos WHERE answer_id = $1`;

//                 await pool.query(photosQuery, [answerId], (err, res) => {

//                   console.log(':::photosQuery cb invoked:::');

//                   if (err) {
//                     cb(err);
//                   } else {
//                     const photos = res.rows;
//                     question.answers[answerId].photos = photos.map(photo => photo.url);

//                     if (question.answers[answerId].photos === undefined) {
//                       question.answers[answerId].photos = [];
//                     }

//                     console.log('i:::', i);
//                     console.log('j:::', j);

//                     if (i === questions.length - 1 && j === answers.length - 1) {
//                       console.log(':::final callback invoked:::');

//                       data.results = questions;
//                       cb(null, data);
//                     }
//                   }
//                 });
//               }
//             }
//           }
//         });
//       }
//     }
//   });
// }

// const getAllAnswers = async (questionId, page = 1, count = 5, cb) => {
//   const offset = (page - 1) * count;

//   const data = {
//     question: questionId,
//     page: page,
//     count: count,
//   }

//   let answersQuery = `SELECT id AS answer_id, body, to_timestamp(date_written / 1000) AS date, answerer_name, helpful AS helpfulness
//     FROM answers
//     WHERE question_id = $1
//     AND reported = 0
//     LIMIT $2 OFFSET $3`;

//   await pool.query(answersQuery, [questionId, count, offset], (err, res) => {
//     if (err) {
//       cb(err);
//     } else {
//       const answers = res.rows;

//       for (let j = 0; j < answers.length; j++) {
//         const answer = answers[j];
//         const answerId = answers[j]['answer_id'];

//         let photosQuery = `SELECT url FROM photos WHERE answer_id = ${answerId}`;

//         pool.query(photosQuery, (err, res) => {
//           if (err) {
//             cb(err);
//           } else {
//             const photos = res.rows;

//             answer.photos = photos.map(photo => photo.url);

//             if (answer.photos === undefined) {
//               answer.photos = [];
//             }

//             if (j === answers.length - 1) {
//               data.results = answers;
//               cb(null, data);
//             }
//           }
//         });
//       }
//     }
//   });
// }