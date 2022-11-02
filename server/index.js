const express = require('express'), http = require('http');
const app = express(); 
const server = http.createServer(app);

const pty = require("node-pty");
const os = require("os");

var shell = os.platform() === "win32" ? "pwsh.exe" : "bash";

const io = require("socket.io")(server, {
    cors: { origin: "*" },
});

io.on("connection", (socket) => {
    var ptyProcess = pty.spawn(shell, [], {
        name: "xterm-256color",
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
        env: process.env,
    });

    ptyProcess.on("data", function (data) {
        io.emit("terminal.incomingData", data);
    });

    socket.on("terminal.keystroke", (data) => {
        ptyProcess.write(data);
    });
});

const port = process.env.Port | 8080;
server.listen(8080, () => console.log("Server listening on : ", port));

io.on("connection", socket => {
    console.log("Client connect to socket.", socket.id);

    this.socket = socket;

    // Just logging when socket disconnects.
    this.socket.on("disconnect", () => {
        console.log("Disconnected Socket: ", socket.id);
    });
});