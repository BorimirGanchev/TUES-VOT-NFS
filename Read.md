# Проект: Node.js приложение с Keycloak автентикация

## Описание

Този проект е Node.js REST API приложение, което използва **Keycloak** за управление на автентикация и авторизация с JWT. Поддържа операции за работа с файлове чрез NFS сървър.

---

## Изисквания

- **Docker** и **Docker Compose** (за стартиране на Keycloak и NFS сървъра)
- **Node.js** (за стартиране на бекенда)
- **Postman** или cURL (за тестване на API)

---

## Стъпки за стартиране на проекта

### 1. Настройка на Docker Compose

1. Клонирайте проекта:
   ```bash
   git clone <URL на репозиторито>
   cd <име на проекта>
   ```

2. Стартирайте Keycloak и NFS сървъра с Docker Compose:
   ```bash
   docker-compose up -d
   ```

   Това ще стартира:
   - **Keycloak** на `http://localhost:8080`.
   - **NFS сървър**, който е свързан с Node.js приложението за съхранение на файлове.

---

### 2. Конфигурация на Keycloak

1. Отворете Keycloak в браузъра: [http://localhost:8080](http://localhost:8080).

2. Влезте с администраторски потребител:
   - **Потребителско име:** `admin`
   - **Парола:** `admin`

3. Създайте нов Realm:
   - **Име на Realm:** `<your name>`.

4. Създайте клиент:
   - Отидете в **Clients** > **Create**.
   - **Client ID:** `node-backend`.
   - **Access Type:** `confidential`.
   - **Root URL:** `http://localhost:3000`.

5. Конфигурирайте ролите:
   - В **Roles** добавете нова роля: `user`.

6. Създайте тестов потребител:
   - Отидете в **Users** > **Add User**.
   - Въведете потребителско име (например: `testuser`).
   - Задайте парола в **Credentials** (например: `password`).
   - В **Role Mappings** добавете роля `user`.

---

### 3. Стартиране на Node.js приложението

1. Инсталирайте зависимостите:
   ```bash
   npm install
   ```

2. Стартирайте приложението:
   ```bash
   node app.js npm start
   ```
---


### 1. Примерни API заявки

#### 1.1. Публична заявка
Тази заявка не изисква автентикация.
```bash
curl http://localhost:3000/public
```

#### 1.2. Вход в Keycloak (получаване на JWT токен)
Изпратете POST заявка към Keycloak:
```bash
curl -X POST "http://localhost:8080/realms/node-app/protocol/openid-connect/token" -H "Content-Type: application/x-www-form-urlencoded" -d "grant_type=password" -d "client_id=node-app" -d "username=testuser" -d "password=0000" -d "email=test@gmail.com" -d "client_secret=O0i6gQwAwrLUAJgyntpLANXqDFM6LYMy"
```

Ще получите отговор с JWT токен:
```json
{
  "access_token": "<вашият токен>",
  "expires_in": 300,
  "refresh_token": "<рефреш токен>"
}
```

---

### 2. Операции с файлове

#### 2.1. Качване на файл
```bash
curl -X POST http://localhost:3000/file/upload \
-H "Authorization: Bearer <JWT_TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "fileName": "example.txt",
  "content": "This is a test file."
}'
```

#### 2.2. Изтегляне на файл
```bash
curl -X GET http://localhost:3000/file/<file_id> \
  -H "Authorization: Bearer <вашият токен>"
```

#### 2.3. Актуализация на файл
```bash
curl -X PUT http://localhost:3000/file/example.txt \
-H "Authorization: Bearer <JWT_TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "content": "Updated file content."
}'
```

#### 2.4. Изтриване на файл
```bash
curl -X DELETE http://localhost:3000/file/<file_id> \
  -H "Authorization: Bearer <вашият токен>"
```

---
