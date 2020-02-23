const express = require("express");
const amqp = require("amqplib/callback_api");

let app = express();

app.get("/ping", (req, res) => res.send("Pong !"));

let connections = {};

app.get("/event-stream/:clientId", (req, res) => {
  let clientId = req.params.clientId;

  // SSE Setup
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });
  res.write("\n");

  connections[clientId] = res;

  console.log("Connection open for client : " + clientId);

  req.on("close", () => {
    delete connections[clientId];
  });
});

app.use(express.static(__dirname + "/public"));

app.get("*", function(request, response) {
  response.sendFile(__dirname + "/public/index.html");
});

let port = process.env.PORT || "3000";

app.listen(port, () => {
  console.log("Server listening on port: " + port);
});

amqp.connect("amqp://localhost", (error0, connection) => {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    let exchange = "notif";

    channel.assertExchange(exchange, "fanout", {
      durable: false
    });

    channel.assertQueue("", { exclusive: true }, (error2, q) => {
      if (error2) {
        throw error2;
      }

      console.log(
        " [*] NodeConsumer : Waiting for messages in %s. To exit press CTRL+C",
        q.queue
      );

      channel.bindQueue(q.queue, exchange, "");

      channel.consume(
        q.queue,
        msg => {
          if (msg.content) {
            let data = JSON.parse(msg.content.toString());

            console.log("New message for client : " + data.clientId);
            let clientRes = connections[data.clientId];

            if (clientRes) {
              clientRes.write(`event: notif\n`);
              clientRes.write(`data: ${data.content}\n\n`);
            }
          }
        },
        {
          noAck: true
        }
      );
    });
  });
});
