FROM node:8-alpine

ENV NODE_ENV=production

ADD dist/ /app
WORKDIR /app

EXPOSE 8002

CMD ["node", "./index.js"]
