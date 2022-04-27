import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

export const requests = new Counter('http_reqs');

// export const options = {
//   stages : [
//     { duration: '30s', target: 1 },
//     { duration: '30s', target: 1 },
//     { duration: '30s', target: 1 },
//   ],
//   thresholds: {
//     requests: ['count < 100'],
//   },
// };

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 100,
      maxVUs: 200,
    }
  }
}

export default function () {

  // http.get(`http://localhost:3071/qa/questions?product_id=${Math.floor(Math.random() * 1000011)}`);

  http.get(`http://localhost:3071/qa/questions/${Math.floor(Math.random() * 3518963)}/answers`);

  // max product id in questions table
  // const getProductId = Math.floor(Math.random() * 1000011);
  // let res1 = http.get(`http://localhost:3071/qa/questions?product_id=${getProductId}`);
  // check(res1, {
  //   'get all questions status was 200': (r) => r.status == 200,
  //   'response body': (r) => r.body.indexOf('results') !== -1,
  // });
  // sleep(1);

  // // max questionId in answers table
  // const getQuestionId = Math.floor(Math.random() * 3518963);
  // let res2 = http.get(`http://localhost:3071/qa/questions/${getQuestionId}/answers`);
  // check(res2, {
  //   'get all answers status was 200': (r) => r.status == 200,
  //   'response body': (r) => r.body.indexOf('results') !== -1,
  // });
  // sleep(1);

  // const postProductId = Math.floor(Math.random() * 1000011);
  // let res3 = http.post(`http://localhost:3071/qa/questions?product_id=${postProductId}`);
  // check(res3, {
  //   'question post status was 201': (r) => r.status == 201,
  // });
  // sleep(1);

  // const postQuestionId = Math.floor(Math.random() * 3518963);
  // let res4 = http.post(`http://localhost:3071/qa/questions/${postQuestionId}/answers`);
  // check(res4, {
  //   'question post status was 201': (r) => r.status == 201,
  // });
  // sleep(1);

  // const putQuestionIdHelp = Math.floor(Math.random() * 3518963);
  // let res5 = http.put(`http://localhost:3071/qa/questions/${putQuestionIdHelp}/helpful`);
  // check(res5, {
  //   'update question helpful status was 204': (r) => r.status == 204,
  // });
  // sleep(1);

  // const putQuestionIdReport = Math.floor(Math.random() * 3518963);
  // let res6 = http.put(`http://localhost:3071/qa/questions/${putQuestionIdReport}/report`);
  // check(res6, {
  //   'update question reported status was 204': (r) => r.status == 204,
  // });
  // sleep(1);

  // const putAnswerIdHelp = Math.floor(Math.random() * 6879317);
  // let res7 = http.put(`http://localhost:3071/qa/answers/${putAnswerIdHelp}/helpful`);
  // check(res7, {
  //   'update answer helpful status was 204': (r) => r.status == 204,
  // });
  // sleep(1);

  // const putAnswerIdReport = Math.floor(Math.random() * 6879317);
  // let res8 = http.put(`http://localhost:3071/qa/answers/${putAnswerIdReport}/report`);
  // check(res8, {
  //   'update anser reported status was 204': (r) => r.status == 204,
  // });
  // sleep(1);

  sleep(1);
}
