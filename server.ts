import * as WebSocket from "ws";

// // create WebSocket server with given port
const port: number = Number(process.env.PORT) || 8000;
const server: WebSocket.Server = new WebSocket.Server({ port: port });

// set of connected sockets
const clientSockets: Set<WebSocket> = new Set();
const displaySockets: Set<WebSocket> = new Set();

const buffers: Buffer[] = [];
let counter: number = 0;

server.on("connection", (socket) => {
  clientSockets.add(socket);

  socket.on("message", (message) => {
    if (message === "display") {
      for (let buffer of buffers) {
        socket.send(buffer);
      }

      clientSockets.delete(socket);
      displaySockets.add(socket);

      console.log(`connected display ${displaySockets.size}`);
    } else {
      const buffer: Buffer = <Buffer>message;

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
