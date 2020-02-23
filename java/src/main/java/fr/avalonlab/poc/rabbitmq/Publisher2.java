package fr.avalonlab.poc.rabbitmq;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import io.jooby.annotations.POST;
import io.jooby.annotations.Path;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.concurrent.TimeoutException;

@Path("/2")
public class Publisher2 {

    private static final String EXCHANGE_NAME = "notif";
    
    @POST
    public void postMessage(Message message) throws IOException, TimeoutException {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");

        message.setId(UUID.randomUUID().toString());

        ObjectMapper mapper = new ObjectMapper();
        var msg = mapper.writeValueAsString(message);

        try (Connection connection = factory.newConnection();
             Channel channel = connection.createChannel()) {
            channel.exchangeDeclare(EXCHANGE_NAME, "fanout");

            channel.basicPublish(EXCHANGE_NAME, "", null, msg.getBytes(StandardCharsets.UTF_8));
            System.out.println(" [x] Publisher2 Sent '" + msg + "'");
        }
    }
}
