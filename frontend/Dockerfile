FROM php:7.1.2-apache

LABEL "com.iloveplatos.front.vendor"="iLoveplatos Front"
LABEL version="0.0.2"
LABEL description="docker for front deploy"

# Install dependencies
RUN apt-get update -y
RUN apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs git git-core vim

# Install app
RUN rm -rf /var/www/html/*
ADD src /var/www/html


WORKDIR /var/www/html
RUN mkdir -p web/js
ADD web/js/config.ts web/js/config.ts

#ADD src/package.json /tmp/package.json
RUN npm install
RUN npm install -g bower 
RUN npm install -g grunt-cli
RUN npm install -g typescript
RUN bower install --allow-root
RUN npm install -g tsd
RUN npm install -g tsc
RUN tsd install
RUN tsc --outDir web/js/ web/js/app.ts --out web/built/js/iloveplatos.js --sourceMap
RUN grunt

RUN chown -R www-data:www-data /var/www

RUN apache2 -v

# Enable apache mods.
RUN a2enmod rewrite
RUN a2enmod deflate
RUN a2enmod headers

RUN php -i | grep "php.ini"

COPY config/php/php.ini.dev /usr/local/etc/php/

# Manually set up the apache environment variables
ENV APACHE_RUN_USER www-data
ENV APACHE_RUN_GROUP www-data
ENV APACHE_LOG_DIR /var/log/apache2
ENV APACHE_LOCK_DIR /var/lock/apache2
ENV APACHE_PID_FILE /var/run/apache2.pid
ENV MODE dev

# Update the default apache site with the config we created.
ADD config/apache/apache-config.conf.dev /etc/apache2/sites-enabled/000-default.conf

RUN service apache2 restart

EXPOSE 80

# By default start up apache in the foreground, override with /bin/bash for interative.
CMD /usr/sbin/apache2ctl -D FOREGROUND
