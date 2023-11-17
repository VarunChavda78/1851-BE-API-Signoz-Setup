FROM node:18

WORKDIR /app

ENV NODE_ENV=development

COPY . .

RUN yarn install --frozen-lockfile

CMD sh -c "yarn run start:dev && yarn run migration:run"
