#!/bin/bash

# Provision the bare Ubuntu server with everything needed to run the app.

sudo apt-get update
sudo apt-get install -y mysql-server
sudo service mysql status
sudo service mysql start
sudo mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';"
sudo apt-get install -y redis-server
sudo service redis-server start
sudo apt-get install -y nodejs
sudo apt-get install -y npm 
sudo npm install sails -g
npm install
echo "Don't forget to put config/local.js in place, if needed."
