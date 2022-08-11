FROM node:18 AS builder
WORKDIR /usr/app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build && yarn build-fe

FROM alpine
WORKDIR /usr/app
RUN apk add --no-cache --update nodejs
COPY --from=builder /usr/app/dist ./dist
COPY package.json ./
EXPOSE 3000

CMD [ "npm", "run", "prod" ]
