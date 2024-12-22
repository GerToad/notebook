# Use an official Node.js image as the base
FROM node:18 as development

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"]

FROM node:18 as build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

# Use a lighter image for production
FROM node:18-slim as production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app ./

EXPOSE 3000
CMD ["npm", "start"]
