FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY src/ ./src

# Copy the test files (optional, if needed for testing in the container)
COPY tests/ ./tests

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]