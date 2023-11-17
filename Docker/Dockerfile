FROM node:18

WORKDIR /app

ENV NODE_ENV=development

COPY . .
ADD start.sh /
RUN chmod +x /start.sh

RUN yarn install --frozen-lockfile

CMD ["/start.sh"]
