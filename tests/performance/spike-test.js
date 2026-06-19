import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

// Spike Test: pico repentino de 10x el tráfico normal por 1 minuto
// Tráfico base: 50 usuarios → pico: 500 usuarios
export const options = {
  stages: [
    { duration: '1m', target: 50  },  // Carga base
    { duration: '1m', target: 500 },  // Pico 10x repentino
    { duration: '1m', target: 500 },  // Mantener pico 1 minuto
    { duration: '1m', target: 50  },  // Volver a base
    { duration: '1m', target: 0   },  // Ramp-down
  ],
  thresholds: {
    http_req_failed:   ['rate<0.15'],
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

  sleep(0.3);

  const bizRes = http.get(`${BASE_URL}/business`, headers);
  check(bizRes, { 'business 200': (r) => r.status === 200 });
  errorRate.add(bizRes.status !== 200);

  sleep(0.5);
}
