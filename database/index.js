require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

// const offset = 40344;

// get the questions for a certain product id
client.connect();

let productId = 1;

//(SELECT COUNT(*) FROM product as p WHERE p.store_id=s.id)

// I want to have my "answers" column itself be a query for the answers data at 'the current' question_id

let query = `SELECT questions.id AS question_id, questions.body AS question_body, to_timestamp(questions.date_written) AS question_date, questions.asker_name, questions.helpful AS question_helpfulness, questions.reported, answers.id AS id, answers.body AS body, to_timestamp(answers.date_written) AS date, answers.answerer_name, answers.helpful AS helpfulness
  FROM questions
  JOIN answers ON questions.id = answers.question_id
  WHERE questions.product_id = ${productId}
  AND questions.reported = 0`

client.query(query, (err, res) => {
  if (err) {
    console.log(err.stack);
  } else {
    let result = {
      product_id: productId,
      results: res.rows
    }

    // let question = results.question_id;

    console.log('RESULT:::', result);
  }
  client.end();
});

module.exports = {
  client: client
};