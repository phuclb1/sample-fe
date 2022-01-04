FROM node:14 as build

WORKDIR /app

COPY ./package.json /app/package.json
#RUN npm config set proxy=http://dungnt135:Nhim%60%40042021@fsoft-proxy:8080
#RUN npm config set https-proxy=http://dungnt135:Nhim%60%40042021@fsoft-proxy:8080
#RUN npm config set https_proxy=http://dungnt135:Nhim%60%40042021@fsoft-proxy:8080
#RUN npm config set strict-ssl=false
#RUN npm config set registry=https://hn-repo.fsoft.com.vn/repository/npm/
#RUN npm config set sass_binary_site=http://hn-repo.fsoft.com.vn/repository/github/sass/node-sass/releases/download/
#RUN npm config set phantomjs_cdnurl=http://hn-repo.fsoft.com.vn/repository/github/Medium/phantomjs/releases/download/v2.1.1/

RUN npm install yarn
RUN yarn install
COPY . .

RUN yarn build

FROM nginx
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html