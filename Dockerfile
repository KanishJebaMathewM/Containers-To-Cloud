# Use the official lightweight Node.js 22 Alpine Linux image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the server application code into the container
# Set ownership to the pre-existing unprivileged 'node' user
COPY --chown=node:node server.js .

# Switch to the non-root 'node' user for security
USER node

# Document that the application listens on port 3000
EXPOSE 3000

# Specify the command to start the application
CMD ["node", "server.js"]
