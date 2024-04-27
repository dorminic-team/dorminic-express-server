# Use the official phpMyAdmin image from Docker Hub
FROM arm64v8/phpmyadmin

# Install the MySQL client in the phpMyAdmin container
RUN apt-get update && \
    apt-get install -y default-mysql-client

# Set environment variables for MySQL connection
#ENV PMA_HOST=34.66.40.176
#ENV PMA_PORT=3306
#ENV PMA_USER=root
#ENV PMA_PASSWORD={TcVK9Fc]F4+8pVX
#ENV MYSQL_ROOT_PASSWORD={TcVK9Fc]F4+8pVX

# Expose the phpMyAdmin port
EXPOSE 2222
