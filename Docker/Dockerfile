FROM node:18

WORKDIR /app

ENV NODE_ENV=development

COPY . .

RUN yarn install --frozen-lockfile
RUN yarn run migration:run

CMD ["yarn", "run", "start:dev"]
