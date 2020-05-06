FROM node:alpine as builder

WORKDIR '/app'

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
RUN npm run export

FROM nginx

EXPOSE 80

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/out /app
