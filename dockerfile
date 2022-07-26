FROM node:18

WORKDIR /usr/src/app
COPY . .

RUN yarn && yarn build && yarn build-fe
RUN rm -r ./node_modules

EXPOSE 3000

CMD [ "yarn", "prod" ]
