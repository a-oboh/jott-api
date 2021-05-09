FROM node:12 as base

WORKDIR /usr/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
COPY . /usr/app

# for typescript
# RUN npm run build
# COPY ormconfig.js ./dist/
# COPY .env ./dist/
# WORKDIR ./dist

# ENV PORT=8030

# EXPOSE 8030

# CMD [ "npm", "run", "start" ]

FROM base as test

ENV NODE_ENV=test

RUN npm install

# RUN npm run test

FROM base as production

ENV NODE_ENV=production

RUN npm install --production

RUN npm run build
