const http = require("http").createServer();
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:80",
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true,
  },
  allowEIO3: true,
});
const port = process.env.PORT || 80;

let users = [];
let messages = [];
io.on("connection", (socket) => {
  socket.on("new_user", (x) => {
    console.log("new user", x);
    users.push({
      id: socket.id,
      name:x.name,
      position: x.position,
    });
    io.emit("users", users);
    io.emit("messages", messages);
    console.log(users);
  });
  
  socket.on("disconnect", () => {
    console.log('disconnect user and new users');
    const index = users.indexOf(socket.id);
    users.splice(index, 1);
    console.log('disconnect user and new users');
    console.log(users);
    io.emit("users", users);
  });
  
  socket.on("new_message", (message) => {
    messages.push("<b>" + message.name + ":</b> " + message.message);
    io.emit("messages", messages);
  });
  
  socket.on("pingServer", (message) => {
    console.log("<b>" + message + ":</b> ");
  });

});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
