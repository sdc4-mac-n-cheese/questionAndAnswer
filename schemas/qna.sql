
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS photos CASCADE;

-- CREATE TABLE products (
--   id INT NOT NULL,
--   PRIMARY KEY(id)
-- );

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
  -- FOREIGN KEY(product_id) REFERENCES products(id)
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