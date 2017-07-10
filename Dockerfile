FROM node:8

ENV NODE_ENV=production

ADD dist/ /app
WORKDIR /app

EXPOSE 8002

CMD ["node", "/app/index.js"]
