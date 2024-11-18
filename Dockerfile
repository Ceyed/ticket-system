FROM node:22
WORKDIR /app
RUN npm install -g pnpm
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["sh", "./entrypoint.sh"]
