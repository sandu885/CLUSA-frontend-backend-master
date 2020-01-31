# Deploy Guide

[![Backers on Open Collective](https://opencollective.com/parse-server/backers/badge.svg)][open-collective-link]
[![Sponsors on Open Collective](https://opencollective.com/parse-server/sponsors/badge.svg)][open-collective-link]
[![License][license-svg]][license-link]

### 1. Install nginx server on EC2 Instance(Ubuntu):
* install nginx
 `sudo apt-get update`
 `sudo apt-get dist-upgrade`
 `sudo apt-get install nginx`


### 2. Deploy app on the server
* using the git repository 
 `cd /var/www/html`
 `git clone https://github.com/{{app_name}}`

* using the sftp
* You can upload source code using the sftp
* App path: `/var/www/html/{{app_name}}`

### 3. Build react app
* install nodejs
 `sudo apt-get install nodejs`
* build app
 `cd /var/www/html/{{app_name}}`
