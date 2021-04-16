import * as WebSocket from "ws";

// // create WebSocket server with given port
const port: number = Number(process.env.PORT) || 8000;
const server: WebSocket.Server = new WebSocket.Server({ port: port });

// set of connected sockets
const clientSockets: Set<WebSocket> = new Set(); // list of ordinary (photo) clients
const displaySockets: Set<WebSocket> = new Set(); // list of display clients

// images 
const images: Buffer[] = [];
let counter: number = 0;

// when client connects
server.on("connection", (socket) => {
  // add socket to list of ordinary clients
  clientSockets.add(socket);

  // displatch messages from connected client
  socket.on("message", (message) => {
    if (message === "clear") {
      // clear (sent by clear.html only)
      counter = 0;
      images.length = 0;

      // broadcast "clear" to all 
      for (let socket of displaySockets) {
        socket.send("clear");
      }
    } else if (message === "display") {
      // new connection 
      for (let image of images) {
        socket.send(image);
      }

      // add socket to list of display clients
      clientSockets.delete(socket); // remove from list of ordinary clients
      displaySockets.add(socket); // add to list of display clients

      console.log(`connected display ${displaySockets.size}`);
    } else {
      const image: Buffer = <Buffer>message;

      images[counter] = image;
      counter = (counter + 1) % 64;

      console.log(`reveived image ${images.length}`);

      for (let socket of displaySockets) {
        socket.send(image);
      }
    }
  });

  // closing client
  socket.on("close", () => {
    clientSockets.delete(socket); // remove from list of ordinary clients
    displaySockets.delete(socket); // remove from list of display clients
  });
});
