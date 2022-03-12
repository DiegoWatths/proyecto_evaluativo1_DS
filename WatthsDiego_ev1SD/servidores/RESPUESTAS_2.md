# Respuestas al apartado #2 del evaluativo #1 de Introducción a Sistemas Distribuidos 2022A

## Realizado por Diego Watths C.I.28.000.248

Este sistema es un **sistema distribuido** el cual un servidor principal, **api_frontend_service.js**, recibe peticiones por parte de un cliente y lo redirecciona, primero al servidor **aunthentication_service.js** para comprobar que el el usuario está dentro de la base de datos de usuarios (autenticar) y si el usario y la contraseña están correctos, permitirle que realize la petición al servidor **api_backend_service.js** el cual es un simple REST API que se conecta a una base de datos con _mongoose._ 

A continuación se muestarn una serie de comandos utilizando cURL para poder realiziar las peticiones adecuadas (todas fueron probadas con antelación):

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

curl -X DELETE http://127.0.0.1:3800/delete/DiegoWatths-Diwingo39-PacMan
