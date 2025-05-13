FROM node:20-alpine AS development

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json ./
RUN npm install

# Copying source files
COPY . .

RUN npm run build

# Building app
EXPOSE 4000

# Running the app
CMD ["npm", "run", "start:server"]
