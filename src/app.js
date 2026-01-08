const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

// ✅ EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ STATIC FILES (FIX)
app.use(express.static(path.join(__dirname, "../public")));

// socket.io
io.on("connection", (socket) => {
    socket.on("send-location",(data)=>{
        io.emit("receive-location",{
            id:socket.id,
            ...data
        })
    })
    socket.on("disconnect",(id)=>{
        io.emit("user-disconnected",socket.id);
    })
});

// route
app.get("/", (req, res) => {
  res.render("index");
});

module.exports = server;
