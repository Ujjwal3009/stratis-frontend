import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://4146a4d868f27c28c10b98c3206aeb1f@o4510794552246272.ingest.de.sentry.io/4510794554015824',

  // Tracing
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,

  // Adds request headers and IP for users
  sendDefaultPii: true,
  enableLogs: true,
});
