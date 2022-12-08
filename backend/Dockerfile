FROM node:alpine AS builder

WORKDIR /app
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn
COPY . .
RUN yarn build
COPY ./prod.env ./dist/


FROM node:alpine

RUN apk add --no-cache tzdata

# Set timezone
ENV TZ Europe/Bucharest
RUN cp /usr/share/zoneinfo/$TZ /etc/localtime


RUN mkdir -p /app /uploads \
    && chown -R node:node /app

# END Puppeteer related configuration - used to generate pdf files

WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000

USER node

CMD ["yarn", "start:prod"]
