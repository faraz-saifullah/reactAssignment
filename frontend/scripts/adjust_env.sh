#!/bin/bash

echo "adjusting files to configured domain"
source /home/ec2-user/.bashrc
sed -i "s,\(https://test.idexinnovation.com:8080\|http://localhost:8080\),https://$PIPELINE_DOMAIN:8080,g" /var/www/html/app-*.js
