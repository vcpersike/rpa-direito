import amqp from "amqplib";
import { ScraperFactory } from "./scrapers/ScraperFactory.js";

const queue = "scraper_queue";

(async () => {
    try {
        const connection = await amqp.connect("amqp://admin:admin@localhost");
        const channel = await connection.createChannel();

        process.once("SIGINT", async () => {
            await channel.close();
            await connection.close();
        });

        process.once("SIGTERM", async () => {
            await channel.close();
            await connection.close();
        });

        process.once("exit", async () => {
            await channel.close();
            await connection.close();
        });

        await channel.assertQueue(queue, { durable: false, autoDelete: false });
        await channel.prefetch(1);
        await channel.consume(queue, async (message) => {
            if (message) {
                const content = JSON.parse(message.content.toString());
                console.log(" [x] Received '%s'", content);
                const scraper = ScraperFactory[content.strategy];
                const instance = new scraper();
                const success = await instance.run(content);
                if (success) {
                    channel.ack(message);
                } else {
                    channel.nack(message);
                }
            }
        },
            { noAck: false }
        );
        console.log(" [*] Waiting for messages. To exit press CTRL+C");
    } catch (err) {
        console.warn(err);
    }
})();