import express from "express";
import http from "http";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const participants = {};

const route = express.Router();

const createBoard = async (req, res) => {
  try {
    const { name } = req.body;
    const newBoard = await Board.create({ name });
    res.status(201).json(newBoard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllBoards = async (_, res) => {
  try {
    const boards = await Board.find();
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCanvasData = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { canvasData } = req.body;
    const updatedBoard = await Board.findByIdAndUpdate(
      boardId,
      { canvasData },
      { new: true }
    );
    res.status(200).json(updatedBoard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const boardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  canvasData: {
    type: Object,
    default: {},
  },
  previewData: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Board = mongoose.model("Board", boardSchema);

io.on("connection", (socket) => {
  console.log("connection");

  socket.on("joinRoom", async (roomId, userName) => {
    participants[socket.id] = userName;
    socket.room = roomId;
    socket.join(roomId);

    io.to(roomId).emit("userJoined", { userName });
    const room = io.sockets.adapter.rooms.get(roomId);
    const participantsCount = room ? room.size : 0;
    io.to(roomId).emit("participantsCount", participantsCount);

    const roomParticipants = getRoomParticipants(roomId);
    io.to(roomId).emit("participantsList", roomParticipants);
  });

  socket.on("leaveRoom", async (roomId, userName) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (room) {
      socket.leave(room);
      io.to(roomId).emit("userLeft", { userName });
      const participantsCount = room ? room.size : 0;
      io.to(roomId).emit("participantsCount", participantsCount);
      const roomParticipants = getRoomParticipants(roomId);
      io.to(roomId).emit("participantsList", roomParticipants);
    }
  });

  socket.on("client-ready", async (boardId) => {
    try {
      socket.join(boardId);
      const board = await Board.findById(boardId);
      const canvasData = board.canvasData;
      io.to(boardId).emit("canvas-state-from-server", canvasData);
    } catch (error) {
      console.log("Error getting canvas data", error);
    }
  });

  socket.on("canvas-state", async ({ boardId, canvasData, previewData }) => {
    if (!canvasData) return;
    try {
      const board = await Board.findById(boardId);
      board.canvasData = canvasData;
      board.previewData = previewData;
      await board.save();

      io.to(boardId).emit("canvas-state-from-server", canvasData);
      console.log("received canvas state");
    } catch (error) {
      console.log("Error updating canvas data", error);
    }
  });

  socket.on("clear", async ({ boardId }) => {
    try {
      const board = await Board.findById(boardId);
      board.canvasData = {};
      await board.save();
      socket.join(boardId);
      io.to(boardId).emit("clear");
    } catch (error) {
      console.error("Error clearing canvas data:", error);
    }
  });

  socket.on("disconnect", () => {
    const room = io.sockets.adapter.rooms.get(socket.room);
    const participantsCount = room ? room.size : 0;
    io.to(socket.room).emit("participantsCount", participantsCount);
    const roomParticipants = getRoomParticipants(socket.room);
    io.to(socket.room).emit("participantsList", roomParticipants);
    delete participants[socket.id];
  });
});

function getRoomParticipants(roomId) {
  const room = io.sockets.adapter.rooms.get(roomId);
  const participantIds = room ? Array.from(room) : [];

  const roomParticipants = participantIds.map((id) => participants[id]);

  return roomParticipants;
}

route.post("/boards", createBoard);
route.get("/boards", getAllBoards);
route.put("/boards/:boardId", updateCanvasData);

app.use(bodyParser.json());
app.use(cors());
dotenv.config();

const PORT = process.env.PORT || 3000;
const URL = process.env.MONGO_URL;

mongoose.set("strictQuery", false);
mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DB connected successfully");

    server.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT} `);
    });
  })
  .catch((error) => console.error(error));

app.use("/api", route);
