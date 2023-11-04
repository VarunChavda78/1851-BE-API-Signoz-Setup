# 🧑‍💻 Development
#
FROM node:18

WORKDIR /app

ENV NODE_ENV=development

COPY . .

RUN yarn install --frozen-lockfile

CMD ["yarn", "run", "start:dev"]
