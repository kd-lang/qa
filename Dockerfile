# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the TypeScript source code
RUN npm run build

# The command to run when the container launches
# The app will run the compiled JavaScript file from the dist directory
ENTRYPOINT ["node", "dist/index.js"]
