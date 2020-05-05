FROM node:alpine as builder

WORKDIR '/app'

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:static

FROM nginx

EXPOSE 80

COPY --from=builder /app/out /usr/share/nginx/html
