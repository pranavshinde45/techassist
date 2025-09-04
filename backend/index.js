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

const allowedOrigins = [
  "http://localhost:3000", // local dev
  "https://techassist-git-main-pranav-shindes-projects-9da17069.vercel.app" // deployed frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use((req,res,next)=>{
  console.log(req.url)
  next()
})
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

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


server.listen(port, () => {
  console.log("Server running on port ",port);
});
