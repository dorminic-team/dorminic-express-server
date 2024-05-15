# Use an official Node.js image as the base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 for Express.js
EXPOSE 3000

# Set environment variables for MySQL and phpMyAdmin
ENV MYSQL_ROOT_PASSWORD={TcVK9Fc]F4+8pVX
ENV MYSQL_DATABASE=my_database
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD={TcVK9Fc]F4+8pVX
ENV PMA_HOST=root

# Copy the SQL initialization script to create tables and populate data
COPY ./init.sql /docker-entrypoint-initdb.d/

# Install MySQL and phpMyAdmin
RUN apt-get update && apt-get install -y mysql-server phpmyadmin

# Expose ports for MySQL and phpMyAdmin
EXPOSE 3306 80

# Command to start the services
CMD ["npm", "start"]
