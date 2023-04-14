# Specify the base image
FROM node:19-alpine

# Set the working directory
WORKDIR /app

# Copy the application files to the working directory
COPY package*.json ./
COPY . ./

# Install dependencies
RUN npm install

# Expose port 7700
EXPOSE 8800

# Start the application
CMD [ "npm", "start" ]
