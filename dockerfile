FROM node:18 AS builder
WORKDIR /usr/app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm i
COPY . .
RUN pnpm run build && pnpm run build-fe

FROM alpine
WORKDIR /usr/app
RUN apk add --no-cache --update nodejs npm
COPY --from=builder /usr/app/dist ./dist
COPY package.json ./
EXPOSE 3000

CMD [ "npm", "run", "prod" ]
