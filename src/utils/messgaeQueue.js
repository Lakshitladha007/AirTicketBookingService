const amqplib = require("amqplib");
const { MESSAGE_BROKER_URL, EXCHANGE_NAME } = require('.././config/serverconfig');

const createChannel = async () => {

    try {
        const connection = await amqplib.connect(MESSAGE_BROKER_URL); // setting up a connection to 'rabbitMQ'
        const channel = await connection.createChannel(); // creating a channel
        await channel.assertExchange(EXCHANGE_NAME, 'direct', false); // setting up the distributor
        return channel;
    } catch (error) {
        throw error;
    }
}

const subscribeMessage = async (channel, service, binding_key) => { // from where ever we are going to subscribe, 
                                                        //'binding key' will be passed as corresponding arguement
    try {
        const applicationQueue = await channel.assertQueue(QUEUE_NAME); // it makes sure that the "QUEUE_NAME" channel 
        // is created, if not this statement will create
        // it

        channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_key);

        channel.bindQueue(applicationQueue.queue, msg => {
            console.log('recieved data');
            console.log(msg.content.toString()); // printing the message
            channel.ack(msg);  // acknowleding that the message has been subscribed buy corresponsing subscriber
        });
    } catch (error) {
        throw error;
    }

}

const publishMessage = async (channel, binding_key, message) => {
    try {
        await channel.assertQueue('QUEUE_NAME');
        await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    } catch (error) {
        throw error;
    }
}

module.exports = {
    subscribeMessage,
    createChannel,
    publishMessage
}
