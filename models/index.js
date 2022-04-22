const { client } = require('../database/index.js');

client.query('SELECT * FROM questions WHERE id = 1', (err, res) => {
  console.log(err ? err.stack : res.rows[0]);
  client.end();
});