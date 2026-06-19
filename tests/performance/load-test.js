import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const loginDuration = new Trend('login_duration');
const businessDuration = new Trend('business_duration');

// Load Test: ramp-up 5 min → carga sostenida 10 min → ramp-down 2 min
export const options = {
  stages: [
    { duration: '5m',  target: 50 },
    { duration: '10m', target: 50 },
    { duration: '2m',  target: 0  },
  ],
  thresholds: {
    http_req_failed:   ['rate<0.05'],
    http_req_duration: ['p(95)<2000'],
    errors:            ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://aionios-backend.onrender.com';

export default function () {
  // 1. Login
  const loginStart = Date.now();
  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email: 'cliente@example.com', password: 'cliente123' }),
    { headers: { 'Content-Type': 'application/json' } },
  );
  loginDuration.add(Date.now() - loginStart);

  const loginOk = check(loginRes, {
    'login status 200/201': (r) => r.status === 200 || r.status === 201,
    'login retorna token':  (r) => { try { return !!JSON.parse(r.body).token; } catch { return false; } },
  });
  errorRate.add(!loginOk);
  if (!loginOk) { sleep(1); return; }

  const { token } = JSON.parse(loginRes.body);
  const headers = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };

  sleep(0.5);

  // 2. Listar negocios
  const bizStart = Date.now();
  const bizRes = http.get(`${BASE_URL}/business`, headers);
  businessDuration.add(Date.now() - bizStart);
  check(bizRes, { 'business 200': (r) => r.status === 200 });
  errorRate.add(bizRes.status !== 200);

  sleep(1);

  // 3. Listar servicios
  const svcRes = http.get(`${BASE_URL}/services`, headers);
  check(svcRes, { 'services 200': (r) => r.status === 200 });
  errorRate.add(svcRes.status !== 200);

  sleep(1);
}
