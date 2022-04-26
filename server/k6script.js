import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

export const requests = new Counter('http_reqs');

export const options = {
  stages : [
    { duration: '1m', target: 1 },
    { duration: '1m', target: 1 },
    { duration: '1m', target: 1 },
  ],
  thresholds: {
    requests: ['count < 100'],
  },
};

export default function () {

  const productId = 2;
  let res = http.get(`http://localhost:3071/qa/questions?product_id=${productId}`);
  check(res, {
    'status was 200': (r) => r.status == 200,
    'response body': (r) => r.body.indexOf('Feel free to browse') !== -1,
  });
  sleep(1);

  // const questionId = 7;
  // let res = http.get(`http://localhost:3071/qa/questions/:${questionId}/answers`);
  // check(res, { 'status was 200': (r) => r.status == 200});

}
