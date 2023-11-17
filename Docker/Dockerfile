FROM node:18

WORKDIR /app

ENV NODE_ENV=development

COPY . .

COPY start.sh /app
RUN chmod +X /app/start.sh

RUN yarn install --frozen-lockfile

CMD ["sh",  "/app/start.sh"]