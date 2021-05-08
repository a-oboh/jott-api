FROM node:12 as base

# Create app directory
WORKDIR /usr/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . /usr/app

# for typescript
# RUN npm run build
# COPY ormconfig.js ./dist/
# COPY .env ./dist/
# WORKDIR ./dist

# ENV PORT=8030

# EXPOSE 8030

# CMD [ "npm", "run", "start" ]

FROM base as production

ENV NODE_ENV=production

RUN npm install --production

RUN npm run build



FROM base as test

ENV NODE_ENV=test

RUN npm install

# RUN npm run test