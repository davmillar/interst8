#!/usr/bin/env bash

echo "Provisioning virtual machine..."
export DEBIAN_FRONTEND=noninteractive

echo "Updating apt"
apt-get update > /dev/null

echo "Installing vim"
apt-get install -y vim > /dev/null

echo "Installing Apache and linking /vagrant to /var/www"
apt-get install -y apache2 > /dev/null
if ! [ -L /var/www ]; then
  rm -rf /var/www
  ln -fs /vagrant /var/www
fi

service apache2 stop # > /dev/null
echo "listen 4018" | sudo tee --append /etc/apache2/httpd.conf
echo "ServerName localhost" | sudo tee --append /etc/apache2/httpd.conf
service apache2 restart # > /dev/null
