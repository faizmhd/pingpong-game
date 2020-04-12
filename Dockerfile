# Dockerfile for Ping Pong Express App
FROM node:13.12.0-alpine3.10
# Working directory
WORKDIR /usr/src/app
# Copy all ressources
COPY . .
# Install dependencies
RUN npm install
# Expose the app port
EXPOSE 8080
# Define the cmd to start the app
CMD [ "node", "server.js" ]