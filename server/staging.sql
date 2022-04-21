
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