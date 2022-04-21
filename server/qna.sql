
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS answers;

CREATE TABLE products (
  id SERIAL NOT NULL,
  product_id INT NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE users (
  id SERIAL NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  PRIMARY KEY(id)
);

CREATE TABLE questions (
  id SERIAL NOT NULL,
  body TEXT NOT NULL,
  date BIGINT NOT NULL,
  helpfulness INTEGER NOT NULL,
  reported SMALLINT NOT NULL,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(product_id) REFERENCES products(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE answers (
  id SERIAL NOT NULL,
  body TEXT NOT NULL,
  date BIGINT NOT NULL,
  helpfulness INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(question_id) REFERENCES questions(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE photos (
  id SERIAL NOT NULL,
  url TEXT NOT NULL,
  answer_id INTEGER NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(answer_id) REFERENCES answers(id)
);