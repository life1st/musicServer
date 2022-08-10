FROM node:18 AS builder
WORKDIR /usr/app
COPY . .
RUN yarn && rm -rf ./dist && yarn build && yarn build-fe


FROM alpine
WORKDIR /usr/app
RUN apk add --no-cache --update nodejs yarn
COPY --from=builder /usr/app/dist ./dist
COPY package.json ./

EXPOSE 3000

CMD [ "yarn", "prod" ]
