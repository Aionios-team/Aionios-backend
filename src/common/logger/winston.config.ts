import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-mongodb';

const SENSITIVE_KEYS = [
  'password',
  'password_hash',
  'token',
  'authorization',
  'secret',
  'cvv',
  'pin',
];

function sanitize(obj: unknown): unknown {
  if (!obj || typeof obj !== 'object') return obj;
  const clone: Record<string, unknown> = { ...(obj as Record<string, unknown>) };
  for (const key of Object.keys(clone)) {
    if (SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s))) {
      clone[key] = '[REDACTED]';
    } else if (typeof clone[key] === 'object') {
      clone[key] = sanitize(clone[key]);
    }
  }
  return clone;
}

const sanitizeFormat = winston.format((info) => {
  if (info['meta']) info['meta'] = sanitize(info['meta']);
  if (info['body']) info['body'] = sanitize(info['body']);
  return info;
});

const isProduction = process.env.NODE_ENV === 'production';

const consoleTransport = isProduction
  ? new winston.transports.Console({
      format: winston.format.combine(
        sanitizeFormat(),
        winston.format.timestamp(),
        winston.format.json(),
      ),
    })
  : new winston.transports.Console({
      format: winston.format.combine(
        sanitizeFormat(),
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike('Aionios', {
          colors: true,
          prettyPrint: true,
        }),
      ),
    });

// MongoDB transport — guarda en colección 'app_logs'
const mongoTransport = new winston.transports.MongoDB({
  db: process.env.MONGO_URI ?? 'mongodb://localhost:27017/aionios',
  collection: 'app_logs',
  level: 'warn',   // solo WARN, ERROR y FATAL van a la BD
  options: { useUnifiedTopology: true },
  metaKey: 'meta',
  format: winston.format.combine(
    sanitizeFormat(),
    winston.format.timestamp(),
    winston.format.json(),
  ),
});

export const winstonConfig = {
  level: isProduction ? 'info' : 'debug',
  transports: [consoleTransport, mongoTransport],
};

export const AppLogger = WinstonModule.createLogger(winstonConfig);
