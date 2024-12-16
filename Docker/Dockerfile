FROM node:18

WORKDIR /app


COPY . .

RUN yarn install --frozen-lockfile

RUN yarn run build 

CMD yarn run deploy:prod

