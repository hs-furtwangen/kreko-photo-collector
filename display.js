"use strict";
var display;
(function (display) {
    // const socket: WebSocket = new WebSocket("ws://localhost:8000/");
    const socket = new WebSocket("wss://kreko-photo-collector.herokuapp.com/");
    const images = [];
    let counter = 0;
    socket.binaryType = "blob";
    const imageContainer = document.getElementById("image-container");
    // listen to connection open
    socket.addEventListener("open", (event) => {
        socket.send("display");
    });
    // listen to message from server
    socket.addEventListener("message", (event) => {
        if (event.data === "clear") {
            imageContainer.innerHTML = "";
            images.length = 0;
            counter = 0;
        }
        else {
            const url = URL.createObjectURL(event.data);
            let image = images[counter];
            if (image === undefined) {
                image = document.createElement("img");
                image.style.width = "12%";
                image.style.margin = "0.25%";
                imageContainer.appendChild(image);
                images[counter] = image;
            }
            image.setAttribute("src", url);
            counter = (counter + 1) % 64;
        }
    });
})(display || (display = {}));
//# sourceMappingURL=display.js.map