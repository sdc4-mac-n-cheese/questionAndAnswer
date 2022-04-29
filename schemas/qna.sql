CREATE DATABASE qna;

\c qna;

DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS questions_staging;
DROP TABLE IF EXISTS answers_staging;
DROP TABLE IF EXISTS photos_staging;

CREATE TABLE questions_staging (
  id INT,
  product_id INT,
  body TEXT,
  date_written BIGINT,
  asker_name TEXT,
  asker_email TEXT,
  reported SMALLINT,
  helpful INT
);

CREATE TABLE answers_staging (
  id INT,
  question_id INT,
  body TEXT,
  date_written BIGINT,
  answerer_name TEXT,
  answerer_email TEXT,
  reported SMALLINT,
  helpful INT
);

CREATE TABLE photos_staging (
  id INT,
  answer_id INT,
  url TEXT
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
  PRIMARY KEY(id)
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

CREATE INDEX questions_product_id ON questions(product_id);
CREATE INDEX answers_question_id ON answers(question_id);
CREATE INDEX photos_answer_id ON photos(answer_id);
CREATE INDEX questions_reported ON questions(reported);
CREATE INDEX answers_reported ON answers(reported);

COPY questions_staging(id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
FROM '/home/ubuntu/questions.csv'
DELIMITER ','
CSV HEADER;

COPY answers_staging(id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
FROM '/home/ubuntu/answers.csv'
DELIMITER ','
CSV HEADER;

COPY photos_staging(id, answer_id, url)
FROM '/home/ubuntu/answers_photos.csv'
DELIMITER ','
CSV HEADER;

INSERT INTO questions (product_id, body, date_written, asker_name, asker_email, reported, helpful)
  SELECT product_id, body, date_written, asker_name, asker_email, reported, helpful
  FROM questions_staging;

INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
  SELECT question_id, body, date_written, answerer_name, answerer_email, reported, helpful
  FROM answers_staging;

INSERT INTO photos (answer_id, url)
  SELECT answer_id, url
  FROM photos_staging;