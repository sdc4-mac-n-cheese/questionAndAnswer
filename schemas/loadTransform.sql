-- ran these commands from the command line in my local database

COPY questions_staging(id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
FROM '/Users/charliebailey24/Downloads/questions.csv'
DELIMITER ','
CSV HEADER;

COPY answers_staging(id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
FROM '/Users/charliebailey24/Downloads/answers.csv'
DELIMITER ','
CSV HEADER;

COPY photos_staging(id, answer_id, url)
FROM '/Users/charliebailey24/Downloads/answers_photos.csv'
DELIMITER ','
CSV HEADER;

-- INSERT INTO products (id)
--   SELECT DISTINCT product_id
--   FROM questions_staging
--   ORDER BY product_id;

INSERT INTO questions (product_id, body, date_written, asker_name, asker_email, reported, helpful)
  SELECT product_id, body, date_written, asker_name, asker_email, reported, helpful
  FROM questions_staging;

INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
  SELECT question_id, body, date_written, answerer_name, answerer_email, reported, helpful
  FROM answers_staging;

INSERT INTO photos (answer_id, url)
  SELECT answer_id, url
  FROM photos_staging;


--for ubuntu--
COPY questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
FROM '/home/ubuntu/questions.csv'
DELIMITER ','
CSV HEADER;

COPY answers(id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
FROM '/home/ubuntu/answers.csv'
DELIMITER ','
CSV HEADER;

COPY photos(id, answer_id, url)
FROM '/home/ubuntu/answers_photos.csv'
DELIMITER ','
CSV HEADER;