FROM node:alpine AS builder

WORKDIR /usr/app
COPY package.json yarn.lock ./
RUN yarn


FROM node:alpine

WORKDIR /usr/app
COPY --from=builder /usr/app/node_modules ./node_modules
COPY . .

RUN yarn build && yarn build-fe && rm -r ./node_modules

EXPOSE 3000

CMD [ "yarn", "prod" ]
