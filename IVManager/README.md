- 2022-02-09
-- sequelize-cli, express-mysql-session, crypto 추가
```
npm install --save sequelize-cli express-mysql-session crypto dotenv
```
-- npx sequelize init
-- NODE_ENV 설정
```
SET NODE_ENV="production"
```

- 2022-02-11
-- logginedAt
-- sequelize-cli
```
npx sequelize seed:generate --name users
npx sequelize db:seed:all
```

- 2022-02-14
-- user, inout, betting_record 수정
-- nodemon 추가
```
npm run dev
```