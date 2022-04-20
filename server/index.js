const express = require('express');
const axios = require('axios');

const app = express();

const PORT = 3071;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});