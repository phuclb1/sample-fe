FROM node:14 as build

WORKDIR /app

COPY ./package.json /app/package.json

RUN npm install yarn
RUN yarn install
COPY . .

RUN yarn build

FROM nginx
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html