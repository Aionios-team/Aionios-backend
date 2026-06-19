import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

// Stress Test: incremento progresivo hasta encontrar el punto de quiebre
export const options = {
  stages: [
    { duration: '2m', target: 50  },
    { duration: '2m', target: 100 },
    { duration: '2m', target: 150 },
    { duration: '2m', target: 200 },
    { duration: '2m', target: 250 },
    { duration: '2m', target: 300 },
    { duration: '2m', target: 0   },
  ],
  thresholds: {
    http_req_failed:   ['rate<0.20'],
    http_req_duration: ['p(95)<5000'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://aionios-backend.onrender.com';

export default function () {
  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email: 'cliente@example.com', password: 'cliente123' }),
    { headers: { 'Content-Type': 'application/json' } },
  );

  const loginOk = check(loginRes, {
    'login status 200/201': (r) => r.status === 200 || r.status === 201,
  });
  errorRate.add(!loginOk);
  if (!loginOk) { sleep(1); return; }

  const { token } = JSON.parse(loginRes.body);
  const headers = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };

  sleep(0.5);

  const bizRes = http.get(`${BASE_URL}/business`, headers);
  check(bizRes, { 'business 200': (r) => r.status === 200 });
  errorRate.add(bizRes.status !== 200);

  sleep(0.5);

  const svcRes = http.get(`${BASE_URL}/services`, headers);
  check(svcRes, { 'services 200': (r) => r.status === 200 });
  errorRate.add(svcRes.status !== 200);

  sleep(1);
}
