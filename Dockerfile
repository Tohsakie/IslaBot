FROM node:12.22.12-buster-slim
RUN apt update && apt upgrade -y
COPY . ./app
WORKDIR /app
RUN npm install
CMD ["node", "bot.js"]
