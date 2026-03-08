const express = require('express');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const PORT = process.env.PORT || 8080;
const TARGET = process.env.OLLAMA_TARGET || 'http://host.docker.internal:11434';
const API_KEY = process.env.OLLAMA_PROXY_API_KEY;

if (!API_KEY) {
  throw new Error('Falta OLLAMA_PROXY_API_KEY');
}

app.disable('x-powered-by');

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'rate_limited',
    message: 'Demasiadas solicitudes. Intenta de nuevo más tarde.'
  }
});

app.use(limiter);

app.use((req, res, next) => {
  if (req.path === '/health') return next();

  const auth = req.headers.authorization || '';
  const expected = `Bearer ${API_KEY}`;

  if (auth !== expected) {
    return res.status(401).json({
      error: 'unauthorized',
      message: 'Bearer token inválido o ausente'
    });
  }

  next();
});

app.use('/', createProxyMiddleware({
  target: TARGET,
  changeOrigin: true,
  ws: true,
  proxyTimeout: 300000,
  timeout: 300000,
  onProxyReq: (proxyReq) => {
    proxyReq.removeHeader('authorization');
  }
}));

app.listen(PORT, () => {
  console.log(`ollama-proxy escuchando en puerto ${PORT}`);
  console.log(`reenviando a ${TARGET}`);
});
