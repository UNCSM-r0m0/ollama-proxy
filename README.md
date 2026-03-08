# ollama-proxy

Proxy HTTP con API key y rate limit para exponer Ollama de forma segura (Bearer token, reenvío a Ollama en el host).

## Uso

- **Health** (sin auth): `GET /health` → `{"ok":true}`
- **Ollama API**: todas las rutas bajo `/` requieren `Authorization: Bearer <API_KEY>`.
- Rate limit: 60 peticiones por minuto.

## Variables de entorno

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `OLLAMA_PROXY_API_KEY` | Sí | Token Bearer para autorizar peticiones. |
| `OLLAMA_TARGET` | No | URL de Ollama (default: `http://host.docker.internal:11434`). |
| `PORT` | No | Puerto del proxy (default: `8080`). |

## Ejecución con Docker

```bash
cp .env.example .env
# Editar .env y definir OLLAMA_PROXY_API_KEY

docker build -t ollama-proxy .
docker run --rm -p 8080:8080 --env-file .env ollama-proxy
```

## Integración con docker-compose

Incluir el servicio y usar la misma red que cloudflared para exponer vía Cloudflare Tunnel:

```yaml
ollama-proxy:
  build: ./ollama-proxy
  container_name: ollama-proxy
  restart: unless-stopped
  environment:
    - PORT=8080
    - OLLAMA_TARGET=http://host.docker.internal:11434
    - OLLAMA_PROXY_API_KEY=${OLLAMA_PROXY_API_KEY}
  ports:
    - "8080:8080"
  networks:
    - n8n-network
```

En el tunnel, apuntar el hostname (ej. `ia.r0lm0.dev`) a `http://ollama-proxy:8080`.

## Pruebas

Sin token (esperado 401):

```bash
curl https://ia.r0lm0.dev/v1/models
```

Con token:

```bash
curl https://ia.r0lm0.dev/v1/models -H "Authorization: Bearer TU_TOKEN"
```

## Si el proxy no conecta a Ollama (Windows)

Ollama por defecto escucha en `127.0.0.1:11434`. Para permitir acceso desde Docker:

```powershell
$env:OLLAMA_HOST="0.0.0.0:11434"
ollama serve
```

Luego verificar: `curl http://localhost:11434/v1/models`.
