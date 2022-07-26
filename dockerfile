FROM node:16

WORKDIR /usr/src/app
COPY . .

RUN yarn && yarn build && yarn build-fe

EXPOSE 3000

CMD [ "yarn", "prod" ]
