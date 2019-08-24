FROM node:10

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN npm ci --production && \
    npm cache clear --force
COPY . .

EXPOSE 80
ENV PORT=80

CMD ["node", "--max-old-space-size=200", "scripts/run-microservices-are-made-for-testing.js"]
