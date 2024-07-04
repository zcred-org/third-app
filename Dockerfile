FROM node:18-alpine AS builder

ARG VITE_ZCRED_FRONTEND_URL
ARG VITE_ZCRED_STORE_SECRET_DATA_ROUTE_URL
ARG VITE_CONTRACT_ADDRESS

WORKDIR /app

COPY . .

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM nginx:alpine-slim

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/deployment/default.conf.template /etc/nginx/templates/default.conf.template
