# Shopping App (React + Spring Boot)

- Frontend: `SHOPPING-REACT` (Vite React TS)
- Backend: `SHOPPING-SPRINGBOOT` (Spring Boot 3, WAR, MySQL)

Backend will deploy to Tomcat context path `/shoppingapi` and exposes:
- GET `/shoppingapi/api/items` — list items
- POST `/shoppingapi/api/items` — add item `{ name, price }`

Frontend expects `src/config.js` to contain `BACKEND_URL` pointing to `http://<host>:8080/shoppingapi`.

## Local dev
- Backend: `mvn spring-boot:run`
- Frontend: `npm run dev` in `SHOPPING-REACT`

## MySQL
Create database `shoppingdb` and ensure user root/qwerty.

```
CREATE DATABASE IF NOT EXISTS shoppingdb;
```