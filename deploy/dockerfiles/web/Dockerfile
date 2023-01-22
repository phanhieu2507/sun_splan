FROM node:16-alpine as build

WORKDIR /srv/app

COPY package.json yarn.lock ./

RUN yarn install --production=false --frozen-lockfile

COPY . .

ENV NODE_ENV=production

RUN yarn build

FROM node:16-alpine

WORKDIR /srv/app

COPY package.json yarn.lock next.config.js ./

RUN yarn install --production --forzen-lockfile

COPY --from=build /srv/app/.next .next

CMD [ "yarn", "start" ]
