# Respuestas al apartado #2 del evaluativo #1 de Introducción a Sistemas Distribuidos 2022A

## Realizado por Diego Watths C.I.28.000.248

Este sistema es un **sistema distribuido** el cual un servidor principal, **api_frontend_service.js**, recibe peticiones por parte de un cliente y lo redirecciona, primero al servidor **aunthentication_service.js** para comprobar que el el usuario está dentro de la base de datos de usuarios (autenticar) y si el usario y la contraseña están correctos, permitirle que realize la petición al servidor **api_backend_service.js** el cual es un simple REST API que se conecta a una base de datos con _mongoose._ 

Todos los servicios tienen como host la dirección IP '127.0.0.1' por defeco; por el otro lado, estos se encuentran en diferentes puertos: el primero (**aunthentication_service.js**) se encuentra en el puerto 3900, mientras que el backend (**api_backend_service.js**) en el puerto 3800 y finalmente, el servidor proxy (**api_frontend_service.js**) en el puerto 4000.

Para poder realizar la autenticación, se utiliza la depedencia _passport_ la cual es utilizada pr macroempresas para poder autenticar a sus usuarios; en mi caso, utilizo la dependencia _passport-local_ que es utilizada para poder crear una estrategia de autenticación, de manera local (este difiere de estategias que utilizan otros API, como es _passport-facebook_ o _passport-google-oauth_ que te permiten autenticarte utilizando una cuenta de facebook o gmail, respectivamente). Así como el backend, este se conecta a una base de datos llamada "users" y ahí almacena usarios

El "backend" es un simple REST API que hace una conexión a una base de datos utilizando Mongodb, utilizando la dependencia de _mongoose_, quien permite realizar la conexión a la base de datos. Así como toda REST API, tiene la funcionalidad para poder crear nuevos documentos, buscar un solo documento o todos los documentos, actualizar o eliminar un documento dado pasando un parámetro  que se utiliza como 'key', que en el caso de esta API, es na colleción de Videojuegos donde se tiene el título del mismo, su género, sus desarrolladores y la cantidad de ventas que han tenido, en 2022.

Por último, el servidor Proxy ("frontend") simplemente recibe las peticiones que desea hacerle al backend, donde lo primero que hace es determianr si en los parámetros de la ruta el cliente le apsa también un usuario autenticado, de lo contrario la petición falla y no se le envía nada al backend; en el caso de que el clinte envíe un cliente autenticado (tanto username y password sean correctos según la primera base de datos), entonces la petición se le envía al backend, este porcesa la solicitud, se la devuelve al proxy, y el proxy se la muestra al cliente. **NOTA:** el servidor proxy se maneja utilizando la dependencia _node-fetch_ la cual permite utilizar Fetch API en node, cosa que utilizo para tanto veriicar el usario autenticado desde el proxy como enviar la peticón al backend. 

En términos generales, se utiliza principalmente el header _Content-Type: application/json_ el cual me permite decirle al servidor que se está enviando una solicitud con un cuerpo que es de formato JSON, de tal manera que cuando llegue la información llegue a la ruta, con la ayuda de _body-parser_, se pueda utilizar con el objeto _req.body_; el otro header que se utiliza es el _"Access-Control-Request-Methods": "-X, OPTIONS"_ donde _-X_ es el método que se está ejecutando, este header implica que estos son los metodos que la petición permite para poder gestionar un control con respecto a los métodos de acceso (relacionado con cors), as'i el servidor permite que estos métodos puedan ser procesados.

A continuación se muestran una serie de comandos utilizando cURL para poder realiziar las peticiones adecuadas (todas fueron probadas con antelación):

------------------------------------------------------------------------------------------------------------------------------------------
## COMANDOS CURL (Preferiblemente en el orden en que se presentan):

#NOTA:
Todos los servicios deben estar activos apra que funcione api_frontend_service.js

# aunthentication_service.js
curl -X POST http://127.0.0.1:3900/register -H 'Content-Type:application/json' -d '{"username":"DiegoWatths","password":"Diwingo39"}'

curl -X POST http://127.0.0.1:3900/register -H 'Content-Type:application/json' -d '{"username":"AdriWatths","password":"amws25*"}'

curl -X POST http://127.0.0.1:3900/login -H 'Content-Type:application/json' -d '{"username":"DiegoWatths","password":"Diwingo39"}'

curl -X POST http://127.0.0.1:3900/login -H 'Content-Type:application/json' -d '{"username":"DiegoWatths","password":"Diwingo"}'

curl -X POST http://127.0.0.1:3900/login -H 'Content-Type:application/json' -d '{"username":"AdryWatths","password":"amws25*"}'

# api_backend_service.js
curl -X POST http://127.0.0.1:3800/create -H 'Content-Type:application/json' -d '{"title":"Minecraft","genre":"Sandbox","developers":"Mojang Studios","sales": 238000000}'

curl -X POST http://127.0.0.1:3800/create -H 'Content-Type:application/json' -d '{"title":"Tetris (EA)","genre":"Puzzle","developers":"EA Mobile","sales": 100000000}'

curl -X POST http://127.0.0.1:3800/create -H 'Content-Type:application/json' -d '{"title":"Mario Kart 8 Deluxe","genre":"Kart racing","developers":"Nintendo EAD","sales": 51810000}'

curl http://127.0.0.1:3800

curl http://127.0.0.1:3800/vg/Minecraft

curl -X PATCH "http://127.0.0.1:3800/update/Tetris%20(EA)" -H 'Content-Type:application/json' -d '{"title":"Tetris","developers":"Microsoft","sales": 69}'

curl http://127.0.0.1:3800/vg/Tetris

curl -X DELETE http://127.0.0.1:3800/vg/Tetris

---
https://en.wikipedia.org/wiki/List_of_best-selling_video_games

# api_frontend_service.js

curl http://127.0.0.1:4000/DiegoWatths-Diwingo39

curl http://127.0.0.1:4000/vg/DiegoWatths-Diwingo39-Minecraft

curl -X POST http://127.0.0.1:4000/create/DiegoWatths-Diwingo39 -H 'Content-Type:application/json' -d '{"title":"PacMan","genre":"Maze","developers":"Namco","sales": 42071635}'

curl -X PATCH http://127.0.0.1:4000/update/DiegoWatths-Diwingo39-Minecraft -H 'Content-Type:application/json' -d '{"title":"Red Dead Redemption 2","genre":"Action-Adventure","developers":"RockStars Studios","sales": 43000000}'

curl -X DELETE http://127.0.0.1:4000/delete/DiegoWatths-Diwingo39-PacMan
