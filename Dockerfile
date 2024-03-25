FROM node:20-alpine as base
RUN apk add --no-cache libc6-compat
RUN apk update

# install dependencies
FROM base as build
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci

# build app
COPY tsconfig.json tsconfig.build.json .prettierrc .eslintrc ./
COPY src/ src/
RUN npm run build

# copy dist and start app
FROM base as app

# create user
RUN addgroup --system --gid 1001 server
RUN adduser --system --uid 1001 --ingroup server nodejs

WORKDIR /app
COPY --chown=nodejs:server --from=build app/dist ./dist
COPY --chown=nodejs:server --from=build app/node_modules ./node_modules
COPY --chown=nodejs:server --from=build app/package.json ./package.json

USER nodejs

CMD [ "node", "dist/main.js" ]