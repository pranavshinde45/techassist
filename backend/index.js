const express=require("express")
const dotenv=require("dotenv")
const mongoose=require("mongoose");
const cors=require("cors")
const userRouter = require("./routes/userRoutes");
const shopRouter = require("./routes/techShopRoutes");
const techRouter = require("./routes/technicianRoutes");
const bookingRouter= require("./routes/bookingRoutes");
const reviewRouter = require("./routes/reviewRoutes");

const http = require("http");
const socketIo = require("socket.io");

const app=express();
const port=process.env.PORT || 8000
dotenv.config();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, 
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use("/users",userRouter)
app.use("/techShops",shopRouter)
app.use("/techShops",techRouter)
app.use("/techShops",bookingRouter)
app.use("/techShops",reviewRouter)

const url=process.env.MONGO_URL;
async function main(){
    await mongoose.connect(url)
}
main()
.then(()=>{
    console.log("connection successful")
})


io.on("connection", (socket) => {
  console.log("New client connected: " + socket.id);

  socket.on("join-room", (roomId) => {
  socket.join(roomId);
  // Notify all *other* clients in the room
  socket.to(roomId).emit("user-joined", socket.id);

  console.log(`Socket ${socket.id} joined room ${roomId}`);
});

  socket.on("offer", (data) => {
    socket.to(data.room).emit("offer", data);
  });

  socket.on("answer", (data) => {
    socket.to(data.room).emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.room).emit("ice-candidate", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected: " + socket.id);
  });
});

server.listen(port, () => {
  console.log("Server running on port ",port);
});
