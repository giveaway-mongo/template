FROM node:18-alpine As install

WORKDIR /app

COPY --chown=node:node scripts/protogen.sh package.json pnpm-lock.yaml ./
COPY --chown=node:node prisma ./prisma
COPY --chown=node:node protos ./protos

RUN ls -la

ENV PNPM_HOME=/usr/local/bin

RUN npm install -g pnpm

RUN pnpm -v
RUN pnpm install

RUN apk update && apk add curl && apk add bash

# Install protobuf
ENV PROTOC_ZIP=protoc-3.14.0-linux-x86_64.zip

RUN apk add gcompat

RUN apk update && apk add unzip
RUN curl -OL https://github.com/protocolbuffers/protobuf/releases/download/v3.14.0/${PROTOC_ZIP} \
    && unzip -o ${PROTOC_ZIP} -d /usr/local bin/protoc \
    && unzip -o $PROTOC_ZIP -d /usr/local 'include/*' \
    && rm -f $PROTOC_ZIP


RUN ls ./protos -la

RUN chmod +x ./protogen.sh
RUN ./protogen.sh

RUN ls ./protogen -la

RUN npx prisma generate

RUN ls ./prisma/generated -la

FROM node:18-alpine As build

WORKDIR /app

COPY --chown=node:node . .

ENV PNPM_HOME=/usr/local/bin

RUN npm install -g pnpm
RUN npm install -g @nestjs/cli

RUN pnpm -v

COPY --chown=node:node --from=install /app/node_modules ./node_modules
COPY --chown=node:node --from=install /app/protogen ./protogen
COPY --chown=node:node --from=install /app/prisma ./prisma

RUN pnpm build

USER node


FROM node:18-alpine As production

WORKDIR /app

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./
COPY --chown=node:node --from=build /app/package.json ./package.json
COPY --chown=node:node --from=build /app/scripts/docker-entrypoint.sh ./docker-entrypoint.sh
COPY --chown=node:node --from=build /app/ecosystem.config.js ./ecosystem.config.js

ENV PNPM_HOME=/usr/local/bin

RUN npm install -g pnpm

RUN pnpm -v

RUN npm install -g pm2

RUN ls -la

RUN npm install -g dotenv-cli


RUN ls -la

COPY scripts/docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

# env.RUN must be "production"
ENTRYPOINT ["/docker-entrypoint.sh"]
