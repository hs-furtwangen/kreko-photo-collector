"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
// // create WebSocket server with given port
const port = Number(process.env.PORT) || 8000;
const server = new WebSocket.Server({ port: port });
// set of connected sockets
const clientSockets = new Set();
const displaySockets = new Set();
const buffers = [];
let counter = 0;
server.on("connection", (socket) => {
    clientSockets.add(socket);
    socket.on("message", (message) => {
        if (message === "clear") {
            counter = 0;
            buffers.length = 0;
            for (let socket of displaySockets) {
                socket.send("clear");
            }
        }
        else if (message === "display") {
            for (let buffer of buffers) {
                socket.send(buffer);
            }
            clientSockets.delete(socket);
            displaySockets.add(socket);
            console.log(`connected display ${displaySockets.size}`);
        }
        else {
            const buffer = message;
            buffers[counter] = buffer;
            counter = (counter + 1) % 64;
            console.log(`reveived image ${buffers.length}`);
            for (let socket of displaySockets) {
                socket.send(buffer);
            }
        }
    });
    socket.on("close", () => {
        clientSockets.delete(socket);
        displaySockets.delete(socket);
    });
});
//# sourceMappingURL=server.js.map