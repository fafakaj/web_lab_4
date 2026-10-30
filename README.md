# Лабораторная работа №4. Frontend на React

Система управления студентами общежития. Frontend из лабораторной работы №1 перенесён на React.
Данные идут через REST API лабораторной работы №3 (Jakarta EE, PostgreSQL).

| Что | Чем |
|---|---|
| Frontend | React 18, React Router 6, Vite 5 |
| Реактивное программирование | RxJS 7 |
| Глобальное состояние | Context API |
| Авторизация | JWT: access- и refresh-токены |
| Backend | лабораторная работа №3: Java 21, Open Liberty, PostgreSQL 16 |
| Запуск | Docker Compose, Nginx |

## Запуск

Нужен только Docker с Docker Compose. Node, Java и Maven ставить не нужно: всё собирается в контейнерах.

1. Создайте файл настроек из примера и замените `JWT_SECRET` на случайную строку не короче 32 символов:

   ```
   cp .env.example .env
   ```

2. Соберите и запустите приложение:

   ```
   docker compose up --build
   ```

   Первая сборка занимает несколько минут. Приложение готово, когда в логе backend появилась строка
   `The defaultServer server is ready to run a smarter planet.`

3. Откройте в браузере:

   | Что | Адрес |
   |---|---|
   | Приложение | <http://localhost:8081/> |
   | Swagger UI backend | <http://localhost:8080/openapi/ui/> |

4. Войдите как администратор: логин `admin`, пароль `admin12345` (значения `ADMIN_*` из `.env`).
   Новый пользователь после регистрации получает роль USER: он только читает данные.

## Остановка

```
docker compose down
```

Остановить и удалить базу данных:

```
docker compose down -v
```

## Контейнеры

| Сервис | Образ | Что делает |
|---|---|---|
| `frontend` | `node:22-alpine` → `nginx:1.27-alpine` | собирает React-приложение и раздаёт его; запросы `/api/` передаёт в backend |
| `backend` | `maven:3.9` → `open-liberty:kernel-slim` | REST API лабораторной работы №3 |
| `db` | `postgres:16-alpine` | база данных, данные в томе `pgdata` |

## Настройки (`.env`)

| Параметр | Что задаёт |
|---|---|
| `FRONTEND_PORT` | порт приложения на компьютере |
| `BACKEND_PORT` | порт backend на компьютере (Swagger UI) |
| `BACKEND_URL` | адрес backend внутри сети Docker для Nginx |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD` | база данных PostgreSQL |
| `JWT_SECRET` | секрет подписи JWT, не короче 32 символов |
| `JWT_ACCESS_MINUTES`, `JWT_REFRESH_DAYS` | время жизни access- и refresh-токенов |
| `ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | администратор, которого backend создаёт при первом запуске |

## Структура frontend

```
frontend/src/
  App.jsx        маршруты
  pages/         страницы маршрутов
  components/    части страниц
  state/         глобальное состояние (Context API)
  rx/            реактивная логика на RxJS
  api/           HTTP-клиент, токены, запросы к API
  domain/        общежития, валидация, формат дат
```
