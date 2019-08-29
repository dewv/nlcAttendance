#!/bin/bash

# Provision the bare Ubuntu server with everything needed to run the app.

sudo apt-get update
sudo apt-get install mysql-server
sudo service mysql status
sudo service mysql start
sudo mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'RootPassword';"
sudo apt-get install -y nodejs
sudo apt-get install -y npm 
npm install
