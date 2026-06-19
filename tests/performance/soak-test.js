import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const reqDuration = new Trend('request_duration');

// Soak Test (Endurance): carga normal por 2 horas para detectar memory leaks
export const options = {
  stages: [
    { duration: '5m',   target: 30  },  // Ramp-up
    { duration: '110m', target: 30  },  // Carga sostenida 110 min
    { duration: '5m',   target: 0   },  // Ramp-down
  ],
  thresholds: {
    http_req_failed:    ['rate<0.05'],
    http_req_duration:  ['p(95)<3000'],
    request_duration:   ['p(99)<5000'],
    errors:             ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://aionios-backend.onrender.com';

export default function () {
  // 1. Login
  const t0 = Date.now();
  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email: 'cliente@example.com', password: 'cliente123' }),
    { headers: { 'Content-Type': 'application/json' } },
  );
  reqDuration.add(Date.now() - t0);

  const loginOk = check(loginRes, {
    'login status 200/201': (r) => r.status === 200 || r.status === 201,
    'login retorna token':  (r) => { try { return !!JSON.parse(r.body).token; } catch { return false; } },
  });
  errorRate.add(!loginOk);
  if (!loginOk) { sleep(2); return; }

  const { token } = JSON.parse(loginRes.body);
  const headers = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };

  sleep(1);

  // 2. Flujo de navegación realista
  const endpoints = [
    '/business',
    '/services',
    '/requests',
    '/notifications',
  ];

  for (const endpoint of endpoints) {
    const t1 = Date.now();
    const res = http.get(`${BASE_URL}${endpoint}`, headers);
    reqDuration.add(Date.now() - t1);

    check(res, { [`${endpoint} status 200`]: (r) => r.status === 200 });
    errorRate.add(res.status !== 200);

    sleep(2);
  }
}
