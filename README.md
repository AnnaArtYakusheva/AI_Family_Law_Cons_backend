# ⚙️ AI-консультант — Backend API

Backend-сервис для безопасного взаимодействия с LLM (OpenRouter).

---

## 🚀 Назначение

Backend отвечает за:

* хранение API ключа
* обработку запросов от фронтенда
* отправку запросов в OpenRouter
* возврат результата

---

## 🧠 Архитектура

Frontend → Backend → OpenRouter

---

## 📡 API
## Endpoint

### POST `/api/llm`

#### Request

```json
{
  "prompt": "Текст запроса",
  "responseFormat": "json"
}
```

#### Response

```json
{
  "text": "...",
  "usage": {},
  "model": "..."
}
```

---

## ⚙️ Переменные окружения

```env
PORT=3002
OPENROUTER_API_KEY=...
OPENROUTER_MODEL=google/gemini-2.5-flash-lite-preview-09-2025
FRONTEND_ORIGIN=https://annaartyakusheva-ai-family-law-consultant-229c.twc1.net
SITE_URL=https://annaartyakusheva-ai-family-law-consultant-229c.twc1.net/
SITE_TITLE=AI Family Law Consultant
```

---

## 🛠 Запуск

## Локально

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

---

### Docker

```bash
docker build -t ai-backend .
docker run -p 3002:3002 --env-file .env ai-backend
```

---

## 🔐 Безопасность

* API ключ не передается во frontend
* все LLM-запросы идут через backend
* используется CORS

---

## ⚠️ Важно

* не коммитить `.env`
* ограничить `FRONTEND_ORIGIN`
* контролировать лимиты API

---

## 📌 Статус

MVP (в разработке)
