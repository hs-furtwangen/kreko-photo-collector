namespace display {
  // const socket: WebSocket = new WebSocket("ws://localhost:8000/");
  const socket: WebSocket = new WebSocket("wss://kreko-photo-collector.herokuapp.com/");

  const images: HTMLImageElement[] = [];
  let counter: number = 0;

  socket.binaryType = "blob";

  const imageContainer: HTMLImageElement = <HTMLImageElement>document.getElementById("image-container");

  // listen to connection open
  socket.addEventListener("open", (event) => {
    socket.send("display");
  });

  // listen to message from server
  socket.addEventListener("message", (event) => {
    const url: string = URL.createObjectURL(event.data);
    let image: HTMLImageElement = images[counter];

    if (image === undefined) {
      image = <HTMLImageElement>document.createElement("img");
      image.style.width = "12%";
      image.style.margin = "0.25%";
      imageContainer.appendChild(image);
      images[counter] = image;
    }

    image.setAttribute("src", url);
    counter = (counter + 1) % 64;
  });
}
