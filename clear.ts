namespace clear {
  // const socket: WebSocket = new WebSocket("ws://localhost:8000/");
  const socket: WebSocket = new WebSocket("wss://kreko-photo-collector.herokuapp.com/");

  // listen to connection open
  socket.addEventListener("open", (event) => {
    socket.send("clear");
  });
}
