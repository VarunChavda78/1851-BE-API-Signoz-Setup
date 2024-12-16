FROM node:18

WORKDIR /app


COPY . .

RUN yarn install --frozen-lockfile

RUN yarn run build 

RUN yarn typeorm migration:run

CMD yarn run start:prod
