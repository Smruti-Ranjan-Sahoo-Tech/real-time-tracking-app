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
    socket.on("send-location", (data) => {
        io.emit("receive-location", {
            id: socket.id,
            ...data
        })
    })
    socket.on("user-disconnect", (id) => {
        io.emit("user-disconnected", socket.id);
    })
    socket.on("receive-location", (data) => {
        const { id, latitude, longitude } = data;

        map.setView([latitude, longitude], 16);

        if (!userColors[id]) {
            userColors[id] = getRandomColor();
        }

        if (markers[id]) {
            markers[id].setLatLng([latitude, longitude]);
        } else {
            markers[id] = L.marker(
                [latitude, longitude],
                { icon: markerIcons[userColors[id]] }
            ).addTo(map);
        }
    });
});

// route
app.get("/", (req, res) => {
    res.render("Index");
});

module.exports = server;
