# Respuestas al apartado #1 del evaluativo #1 de Introducción a Sistemas Distribuidos 2022A

## Realizado por Diego Watths C.I.28.000.248

**NOTA:** Las respuestas están basadas en la documentación de Node.js que explica el funcionamiento del Bucle de Eventos
(https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/), y el documento guía por Thomas Hunter II _Distributed Systems with Node.js_, donde dichas respuestas se asume que:
* el mismo inicia en la fase de **poll** así descrito en la guía
* las microtareas (MicroTasks) son ejecutadas antes de que inicie una fase posterior
* queueMicrotask() tiene prioridad igualitaria con las Promesas, dependiendo en el orden en el que aparecen en el código.

---------------------------------------------------------------------------------------------------------------------------------------------------

#1

**RESULTADO:** 'new promise' 'async function' ' nextTick 1' 'nextTick 2' 'nextTick 3' 'then 1' 'then 2' 'microTask 1' 'microTask 2' 'immediate 1' ' immediate 2' 'timeout 1' 'timeout 2' 

**ANÁLISIS:**
Este código inicia ejecutado las declaración del objeto Promesa, donde se ejecuta el log del primer elemento y resuelve la promesa, donde se define un .then() que se ejecuta cuando esta fase termine. Así mismo, se define una función asíncrona foo() la cual se invoca inmediatamente y se llama al segundo log; como las funciones asíncronas devuelven una promesa, análogamente se define un .then() que se ejecutará más tarde. Aquí termina la fase de **poll** después de poner cada una de las tareas en su cola respectiva (las macrotareas, como setImmediate() y setTimeout(), van en la MacroQueue mientras que las microtareas, como process.NextTick() , las promesas resueltas y queueMicrotask(), van en la MicroQueue).

Antes de inciar la siguiente fase, **check** (setImmediate()), se ejecutan las microtareas, tomado como prioridad las process.NextTick() por encima de las otras, mostrando el tercer, cuarto y quinto log; siguiente se ejecutan las primeras dos promesas que definimos al principio, mostrado el sexto y séptimo log respectivamente, y por último se muestran las microtareas que antes se añadieron a la cola, mostrando el octavo y noveno log. Ahora verdaderamente inicia la fase **check**.

Después, se ejecuta los setImmediate() mostrando el décimo y décimo primer log. Al ver que no le queda más nada en esta fase, verifica que no exista alguna microtarea por ejecutar y procede a la fase **close callbacks** la cual reconoce que no posee nada en la misma, así que continua a la siguiente fase, tomando en cuenta que al volver pasar la siguiente fase verifica que ninguna microtarea quedó en la cola después de finalizar la fase.

Dentro de la fase **timers** ve que tiene dos setTimeout() que ya han expirado, entonces procede a ejecutar las tareas y muestra el décimo segundo y décimo tercero log, así terminado el programa

#2

**RESULTADO:** 'async function' ' nextTick 1' 'nextTick 2' 'nextTick 3' 'then 2' 'microTask 1' 'microTask 2' 'immediate 1' ' immediate 2' 'timeout 1' 'timeout 2' 'new promise' 'then 1'

**ANÁLISIS:**
Este código tiene un desempeño similar al  anterior, hasta el punto de mostrar los mismos resultados, con la diferencia de que este código inicia leyendo un fichero (readFile()), en el cual al finalizar de leer el mismo, realiza la instancia del objeto Promesa, y como este tipo de tareas se inician en la fase **poll** y se consolidan en la fase **pending callbacks**, se debe esperar hasta que se llegue a dicha fase, exactamente después de la fase **timers**, cosa que trae como resultado que los setTimeout() se ejecuten primero.

En otras palabras, este código es análogo al #1 con la diferencia que la instancia del objeto Promesa se realiza al final por estar dentro de un ciclo I/O, y por ende, su resolución se ejecuta de último.

#3

**RESULTADO:** 'new promise' 'async function' ' nextTick 1' 'nextTick 2' 'nextTick 3' 'then 1' 'then 2' 'microTask 1' 'microTask 2' 'immediate 1' ' immediate 2' 'timeout 1' 'timeout 2' 

**ANÁLISIS:**
Este código es un fichero ECMAScript, lo cual implica que es necesario exportar el fichero para poder ver la funcionalidad del mismo, entonces como se encuentra, **no mostraría nada dado a que no se exportó**; sin embargo, en el caso donde sí se llega a exportar, mostraría **el mismo contenido que el primer código que se vió**, dado a que al importar el código, este se comporta como un fichero .js convencional, y por ende se obtiene los mismos resultados.

#Referencias
* https://medium.com/dkatalis/eventloop-in-nodejs-macrotasks-and-microtasks-164417e619b9
* https://dev.to/lunaticmonk/understanding-the-node-js-event-loop-phases-and-how-it-executes-the-javascript-code-1j9
* https://heynode.com/tutorial/how-event-loop-works-nodejs/
* https://medium.com/swlh/a-short-introduction-to-node-js-event-loop-558f6f2c2af7

