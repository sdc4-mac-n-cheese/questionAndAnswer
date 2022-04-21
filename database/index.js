require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

// just test to see if I can get data back from my local server
client.connect();
client.query('SELECT * FROM questions WHERE id = 1', (err, res) => {
  console.log(err ? err.stack : res.rows[0]);
  client.end();
})