FROM node:18

WORKDIR /usr/app
COPY . .

RUN rm -r .parcel-cache && yarn && yarn build && yarn build-fe && rm -r ./node_modules

EXPOSE 3000

CMD [ "yarn", "prod" ]
