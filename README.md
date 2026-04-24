# Family Law AI Backend

Минимальный backend для MVP AI-консультанта по семейному праву.

Фронт не должен вызывать OpenRouter напрямую.  
Фронт вызывает этот backend, а backend хранит `OPENROUTER_API_KEY` в переменных окружения.

## Локальный запуск

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Проверка:

```bash
curl http://localhost:3002/api/health
```

Тест LLM:

```bash
curl -X POST http://localhost:3002/api/llm \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Верни JSON { \"ok\": true }","responseFormat":"json"}'
```

## Переменные окружения

```env
PORT=3002
OPENROUTER_API_KEY=...
OPENROUTER_MODEL=google/gemini-2.5-flash-lite-preview-09-2025
FRONTEND_ORIGIN=https://annaartyakusheva-ai-family-law-consultant-229c.twc1.net
SITE_URL=https://annaartyakusheva-ai-family-law-consultant-229c.twc1.net/
SITE_TITLE=AI Family Law Consultant
```

## Endpoint

### POST /api/llm

Request:

```json
{
  "prompt": "Текст промпта",
  "responseFormat": "json"
}
```

Response:

```json
{
  "text": "...",
  "usage": null,
  "model": "..."
}
```
