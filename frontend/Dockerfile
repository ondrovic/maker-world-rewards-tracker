ARG TZ
ARG VITE_APP_POINTS_ROUTE
ARG VITE_APP_UPDATED_ROUTE
ARG VITE_APP_NEEDED_POINTS
ARG VITE_APP_TITLE
ARG WEB_PORT
# builder
FROM node:lts-alpine AS build
RUN apk add --no-cache nodejs npm
WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build

# final
FROM ubuntu as app
RUN apt-get update
RUN apt-get install nginx -y \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/dist /var/www/html
COPY --from=build /app/node_modules /app/node_modules

EXPOSE $WEB_PORT
CMD ["nginx", "-g", "daemon off;"]