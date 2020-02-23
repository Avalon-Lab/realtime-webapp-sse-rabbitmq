# realtime-webapp-sse-rabbitmq

Démo Web App temps réel avec SSE et RabbitMQ

## Setup

- Nodejs LTS : https://nodejs.org/en/download/
- Java 11+ : https://adoptopenjdk.net/
- RabbitMQ :
    Le plus simple est via Docker, avec l'UI de management (http://localhost:8282) :

    ```bash
    docker run -d --hostname my-rabbit --name some-rabbit -p 8282:15672 -p 5672:5672 rabbitmq:3-management
    ```

    Ou sans :

    ```bash
    docker run -d --hostname my-rabbit --name some-rabbit -p 5672:5672 rabbitmq:3
    ```

## Démarrage

Dans un terminal, démarrer le serveur nodejs :

    ```bash
    cd node
    node index.js
    ```

Dans un autre terminal, démarrer l'API Java :

    ```bash
    cd java
    ./mvnw jooby:run
    ```

### API REST

Cette API propose deux end points (`POST /1 et POST /2`), chacun branché sur un producer RabbitMQ différents et prenant en body un objet de la forme :

```json
{
    "content":"Hello World !!",
    "clientId":"Toto"
}
```  

Une collection Postman est fournie pour faciliter l'exercice :  
`Demo Realtime Web App -  RabbitMQ & SSE.postman_collection.json`

### IHM

Rendez-vous à l'url [http://localhost:3000](http://localhost:3000).  
Une fois la page chargée (ce qui peut prendre quelques seconde du fait d'une dépendance récupérée sur Pika CDN), saisissez un client id (le même que dans le payload de l'API).  
A chaque nouveau message posté sur l'api, vous verrez le compteur s'incrémenter et le content du payload s'afficher (si les clientId sont les mêmes).  
Vous pouvez bien sur faire le test en ouvrant un second onglet avec un clientId différent et vérifier que les messages sont correctement distribué.