`
  SELECT array(
  SELECT jsonb_build_object(
      'product', product_id,
      'rating', rating,
      'summary', summary,
      'recommend', recommend,
      'response', response,
      'body', body,
      'date', date,
      'reviewer_name', reviewer_name,
      'helpfulness', helpfulness,
      'photos', (
        SELECT ARRAY(
        SELECT json_build_object(
          'id', review_photos.id,
          'url', review_photos.url
        ))
      ))
    FROM review
    INNER JOIN review_photos
    ON review_photos.id = review.id
    WHERE product_id = $3
    ORDER BY date DESC
    LIMIT $1 OFFSET $2
    ) as results`