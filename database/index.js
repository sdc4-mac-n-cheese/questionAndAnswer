const { Client, Pool } = require('pg');

// const client = new Client({
//   user: process.env.USER,
//   host: process.env.HOST,
//   database: process.env.DATABASE,
//   password: process.env.PASSWORD,
//   port: process.env.PORT,
// });


const pool = new Pool({
  user: 'ubuntu',
  host: '50.18.8.27',
  database: 'qna',
  password: 'ubuntu'
});

pool.connect()
  .then((res) => console.log('im in'))
  .catch(err => console.log(err)); 


module.exports = {
  pool: pool,
}
