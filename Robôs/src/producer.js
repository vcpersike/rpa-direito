import amqp from "amqplib";

const queue = "scraper_queue";

const message = {
    choice: "CNPJ"
};

const strategies = ["TRT15", "TRT14", "TRT2"];
const cnpjs = [
    "21695269000100",
    "00000000000191",
    "90400888000142",
    "60701190000104",
    "60746948000112",
    "07237373000120"
]

function choiceList (arr) {
    if (arr.length === 0) { return undefined; }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

(async () => {
    let connection;
    try {
        connection = await amqp.connect("amqp://admin:admin@localhost");
        const channel = await connection.createChannel();

        await channel.assertQueue(queue, { durable: false, autoDelete: false });
        for (const cnpj of cnpjs) {
            message.cnpj_cpf = cnpj;
            message.strategy = choiceList(strategies);
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
            console.log(" [x] Sent '%s'", message);
        }
        console.log(" [x] Sent '%s'", message);
        await channel.close();
    } catch (err) {
        console.warn(err);
    } finally {
        if (connection) await connection.close();
    }
})();