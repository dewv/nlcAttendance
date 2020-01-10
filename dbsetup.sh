#!/bin/bash

mysql -u root -e "CREATE DATABASE IF NOT EXISTS nlcAttendance;"
mysql -u root -e "CREATE USER IF NOT EXISTS 'nlc'@'localhost' IDENTIFIED BY 'password';" 
mysql -u root -e "GRANT SELECT, INSERT, UPDATE, CREATE, DROP ON nlcAttendance.* TO 'nlc'@'localhost';" 
mysql -u root -e "FLUSH PRIVILEGES;"

