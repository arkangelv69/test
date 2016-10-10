Para conseguir ver el frontend en web:

Crear virtual host:

//Este virtual host es para mac
<VirtualHost *:80>
  DocumentRoot "<ruta-absoluta-al-repositorio>/frontend/web"
  ServerName devel.iloveplatos.com
        ErrorLog /private/var/log/apache2/error-iloveplatos.log
        CustomLog /private/var/log/apache2/access-iloveplatos.log combined
  <Directory "<ruta-absoluta-al-repositorio>/frontend/web">
        Options Indexes MultiViews FollowSymLinks
        AllowOverride All
        Order allow,deny
        allow from all
        Require all granted
  </Directory>
</VirtualHost>

Añdir la entrada devel.iloveplatos.com al virtual host

Una vez que tenemos creado esto necesitamos tener instalado los siguientes comandos:

node
npm
bower
grunt

Nota:
tsd y tsc se debería instalar en el ambito del proyecto con npm.

Una vez que están instalados estos comandos, desde una terminal y desde el directorio frontend, ejecutamos lo siguiente:

npm install
bower install
tsd install
tsc --outDir web/js/ web/js/app.ts --out web/built/js/buho.js --sourceMap
grunt

Si cargamos la url devel.iloveplatos.com, se debería ver ya aplicación en el navegador.

Para Cordova:

The winter is coming....