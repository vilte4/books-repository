import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  stages: [
      { duration: '2m', target: 50 },
      { duration: '2m', target: 100 },
      { duration: '2m', target: 150 },
      { duration: '2m', target: 200 },
      { duration: '2m', target: 0 },
  ],
    thresholds: {
        http_req_duration: ['p(95)<500'],
    },
};

export default function () {
    const url = 'function.api.endpoint.url';

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    let response = http.get(url, params);
    console.log(`Response status: ${response.status} and body: ${response.body}`);

    check(response, {
        'status is 201': (r) => r.status === 201,
    });

    sleep(1);
}
