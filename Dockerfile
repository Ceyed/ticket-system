FROM public.ecr.aws/lambda/nodejs:20.2024.11.14.18-x86_64
WORKDIR /app
RUN npm install -g pnpm
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm build
EXPOSE 3000
ENTRYPOINT ["sh", "-c"]
CMD ["pnpm run migration:run && pnpm start"]
