FROM node:22-alpine

WORKDIR /

COPY package*.json ./
RUN npm ci


COPY . .

RUN npx prisma generate

RUN npm run build \
  && npm prune --omit=dev   # devDependencies 제거로 이미지 슬림화

ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "dist/src/main.js"]
