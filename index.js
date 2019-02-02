
const net = require('net');
const fs = require('fs');

// Define switch cases
const messagePrefix = `MSG`;
const pingPrefix = `PNG`;
const disconnectPrefix = `END`;
const shutdownPrefix = `UWU`;

var socketRegistry = [];

// Callback here is called on event 'connection,' and returns a socket object to the connection
const server = net.createServer( (socket) => {

    // Notify presence of new connection
    console.log(`Client at , ${socket.remoteAddress}`);
    
    // Send a message to the client and pipe client data to the terminal
    socket.write(`[CONNECTION ESTABLISHED]\r\n`);

    // Add to registry
    socketRegistry.push(socket);


    // Assign event callbacks
    socket.setEncoding('ascii');
    socket.on('data', (res) => {

        let message = res.slice(0, 3);

        switch(message) {

            case messagePrefix:
                // Post message to Discord
                console.log(`[${Date()}] Snow day! Posting message to Discord`);
                break;

            case pingPrefix:
                // Distribute ping-time data
                console.log(`[${Date()}] Ping-Time Data received - Distributing...`);

                socketRegistry.forEach( (connectionSocket) => {

                    if(!connectionSocket.destroyed){
                        connectionSocket.write(`[${Date()}] Ping!\r\n`);

                    }
                });
                break;

            case disconnectPrefix:
                // Stop communicating with bots
                console.log(`[${Date()}] Emergency communications shutoff - Disconnecting from bots...`);
                
                socketRegistry.forEach( (connectionSocket) => {

                    if(!connectionSocket.destroyed){
                        connectionSocket.write(`END @ [${Date()}]\r\n`);

                    }
                });
                break;

            case shutdownPrefix:
                // Shut down the server
                console.log(`[${Date()}]  Code ${shutdownPrefix}! Shutting down!`);
                process.exit();
                break;

            default:
                // Log queer messages
                console.log(`[${Date()}] Queer message - Logging...`);
                fs.appendFile('LOG', `[${Date()}] - ${res}`, (e) => console.error('\x1b[41m%s\x1b[0m',e));

        }

    });

    socket.on('error', (e) => console.error('\x1b[41m%s\x1b[0m',e));

    socket.on('end', () => {

        server.getConnections( (err,n) => { // Log disconnections and active clients

            if(err) console.error(err);
            console.log(`[${Date()}] Client at ${socket.remoteAddress} disconnected (${n} active )`);

        });

    });
});

server.on('error', (e) => console.error('\x1b[41m%s\x1b[0m',e));

server.listen(8081, () => { // Server listens on port 8081

    console.log(`[${Date()}] Server bound`);

});
