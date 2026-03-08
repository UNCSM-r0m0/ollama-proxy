# Subir este proyecto a GitHub

Este proyecto está pensado para versionarse en un repositorio propio (solo los archivos del proxy).

## Crear el repositorio en la organización

1. Ve a [UNCSM-r0m0/repositories](https://github.com/orgs/UNCSM-r0m0/repositories).
2. **New repository** → nombre: `ollama-proxy`, descripción opcional, **no** inicializar con README.
3. Anota la URL del repo, ej. `https://github.com/UNCSM-r0m0/ollama-proxy.git`.

## Subir solo la carpeta ollama-proxy

Desde la raíz del repo (o desde `ollama-proxy` si el repo se clonó vacío):

```powershell
cd C:\Users\r0lm0\n8n-cloudflare\ollama-proxy
git init
git add .
git commit -m "Initial commit: proxy Ollama con API key y rate limit"
git branch -M main
git remote add origin https://github.com/UNCSM-r0m0/ollama-proxy.git
git push -u origin main
```

Archivos que se suben: `server.js`, `package.json`, `Dockerfile`, `.env.example`, `.gitignore`, `README.md`. El archivo `.env` no se sube (está en `.gitignore`).
