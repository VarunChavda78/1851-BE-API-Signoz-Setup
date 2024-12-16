FROM node:18

WORKDIR /app


COPY . .

RUN yarn install --frozen-lockfile

RUN yarn run build 

CMD /bin/sh -c "yarn run deploy:prod || exit 1"

