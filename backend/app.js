const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const os = require("os");
const cors = require("cors");

const app = express();

app.use(express["json"]());
app.use(cors());

// app.get("/memory", (req, res) => {
//   const total_mem = os["totalmem"]();
//   const free_mem = os["freemem"]();
//   const used_mem = total_mem - free_mem;
//   const used_percentage = ((used_mem / total_mem) * 100)["toFixed"](2);

//   res["json"]({
//     total_mem,
//     free_mem,
//     used_mem,
//     used_percentage,
//   });
// });

// // function check_memory() {
// //     const total_memory = os.totalmem(); // in bytes
// //     const free_memory = os.freemem(); // in bytes

// //     const used_memory = total_memory - free_memory;
// //     const usage_percent = (used_memory / total_memory) * 100;

// //     if (usage_percent > 80) {
// //         console.log("Memory is almost full");
// //     }
// //     else {
// //         console.log("Memory is fine")
// //     }

// // };

// // check_memory();

// app["listen"](3000, () => console.log("🍟Fried chips and  eggs"));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("🔌 Client connected");

  // send memory updates every 2 seconds
  const interval = setInterval(() => {
    const total_mem = os.totalmem();
    const free_mem = os.freemem();
    const used_mem = total_mem - free_mem;
    const used_percentage = ((used_mem / total_mem) * 100).toFixed(2);

    socket.emit("memoryUpdate", {
      total_mem: (total_mem / 1e9).toFixed(2) + " GB",
      free_mem: (free_mem / 1e9).toFixed(2) + " GB",
      used_mem: (used_mem / 1e9).toFixed(2) + " GB",
      used_percentage: used_percentage + "%",
    });
  }, 2000);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
    clearInterval(interval);
  });
});

server.listen(3000, () => console.log("🍟 Fried chips and eggs on http://localhost:3000"));
