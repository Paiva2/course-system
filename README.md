# Course System Challenge - Cefis

## Technologies

- TypeScript
- Node
- Express
- Postgres;
- Docker;
- Vitest (for unit tests);
- Nodemailer;
- Swagger for docs.

## Installation guide

### You will need Node version >= 18.0.0

```
bash

$ git clone https://github.com/Paiva2/course-challenge.git

$ cd course-challenge

$ npm run install:both

$ cd backend

$ docker compose up -d

$ npx prisma migrate dev --name init db or npx prisma migrate deploy

$ cd ..

$ npm run dev

```

## Logins to use for tests

- Student: e-mail: student@email.com // password: 123456

- Professor: e-mail: professor@email.com // password: 123456

- Admin: e-mail: admin@email.com // password: admin123

### You will find all endpoints docs on localhost:5000/docs/#/
