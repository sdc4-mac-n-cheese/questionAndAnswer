
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS photos CASCADE;

CREATE TABLE products (
  id INT NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE questions (
  id SERIAL NOT NULL,
  product_id INT NOT NULL,
  body TEXT NOT NULL,
  date_written BIGINT NOT NULL,
  asker_name TEXT NOT NULL,
  asker_email TEXT NOT NULL,
  reported SMALLINT NOT NULL,
  helpful INTEGER NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(product_id) REFERENCES products(id)
);

CREATE TABLE answers (
  id SERIAL NOT NULL,
  question_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  date_written BIGINT NOT NULL,
  answerer_name TEXT NOT NULL,
  answerer_email TEXT NOT NULL,
  reported SMALLINT NOT NULL,
  helpful INTEGER NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(question_id) REFERENCES questions(id)
);

CREATE TABLE photos (
  id SERIAL NOT NULL,
  answer_id INTEGER NOT NULL,
  url TEXT NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(answer_id) REFERENCES answers(id)
);