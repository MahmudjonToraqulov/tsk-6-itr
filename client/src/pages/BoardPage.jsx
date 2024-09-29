import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { AiOutlineUserSwitch } from "react-icons/ai";
import { createGeometryShape } from "../utils/createGeometryShape";
import { useSelector } from "react-redux";
import exportCanvasToJPEG from "../utils/exoprtCanvasToJPEG";
import RoomInfo from "../components/Board/RoomInfo";
import UserAmount from "../components/Board/UserAmount";
import ToolPanel from "../components/Board/ToolPanel";

const updateEventList = [
  "object:modified",
  "object:added",
  "object:removed",
  "object:moved",
];

const BoardPage = () => {
  const { editor, onReady } = useFabricJSEditor();
  const [color, setColor] = useState("#000");
  const [isDrawing, setIsDrawing] = useState(false);
  const [isRoomInfo, setIsRoomInfo] = useState(false);
  const [brushSize, setBrushSize] = useState();
  const [userCount, setUserCount] = useState(0);

  const [actions, setActions] = useState([]);
  const [participants, setParticipants] = useState([]);

  const { id } = useParams();
  const socket = io("https://tsk-6-itr-2.onrender.com/");
  const userNameFromState = useSelector((state) => state.users.userName);

  const update = () => {
    console.log("canvas updated");
    const data = editor.canvas.toJSON();
    const preview = editor.canvas.toDataURL();
    socket.emit("canvas-state", {
      boardId: id,
      canvasData: data,
      previewData: preview,
    });
  };

  const addUpdateEvents = () => {
    updateEventList.forEach((event) => {
      editor.canvas.on(event, () => {
        update();
      });
    });
  };

  const removeUpdateEvents = () => {
    updateEventList.forEach((event) => {
      editor.canvas.off(event);
    });
  };

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
    editor.canvas.freeDrawingBrush.color = color;
    editor.canvas.freeDrawingBrush.width = brushSize;
    editor.setStrokeColor(color);
  }, [color, brushSize]);

  const onAddCircle = () => {
    const { shape: circle } = createGeometryShape({
      canvas: editor.canvas,
      shapeType: "circle",
      color,
    });

    editor.canvas.add(circle);
  };

  const onAddRectangle = () => {
    const { shape: rectangle } = createGeometryShape({
      canvas: editor.canvas,
      shapeType: "rect",
      color,
    });

    editor.canvas.add(rectangle);
  };

  const onAddLine = () => {
    const { shape: line } = createGeometryShape({
      canvas: editor.canvas,
      shapeType: "line",
      color,
    });

    editor.canvas.add(line);
  };

  const onAddTriangle = () => {
    const { shape: triangle } = createGeometryShape({
      canvas: editor.canvas,
      shapeType: "triangle",
      color,
    });

    editor.canvas.add(triangle);
  };

  const toggleDrawingMode = () => {
    editor.canvas.isDrawingMode = !editor.canvas.isDrawingMode;
    setIsDrawing(!isDrawing);
  };

  const onSizeChange = (value) => {
    setBrushSize(value);
  };

  const history = [];

  const undo = () => {
    if (editor.canvas._objects.length > 0) {
      const removedObject = editor.canvas._objects.pop();
      history.push(removedObject);
      update();
    }
    editor.canvas.renderAll();
  };

  const redo = () => {
    if (history.length > 0) {
      const restoredObject = history.pop();
      editor.canvas.add(restoredObject);
      update();
    }
  };

  const clear = () => {
    socket.emit("clear", { boardId: id });
  };

  const removeSelectedObject = () => {
    editor.canvas.remove(editor.canvas.getActiveObject());
  };

  const handleExportCanvas = () => {
    exportCanvasToJPEG(editor.canvas);
  };

  useEffect(() => {
    if (!editor || !editor.canvas) {
      return;
    }
    removeUpdateEvents();
    addUpdateEvents();

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("client-ready", id);
    });

    socket.on("participantsList", (participantsList) => {
      setParticipants(participantsList);
    });

    socket.emit("joinRoom", id, userNameFromState);

    socket.on("userJoined", ({ userName }) => {
      const joinMessage = `${userName} joined the room.`;
      setActions((prevActions) => [...prevActions, joinMessage]);
    });

    socket.on("participantsCount", (count) => {
      setUserCount(count);
    });

    const handleBeforeUnload = () => {
      socket.emit("leaveRoom", id, userNameFromState);
      removeUpdateEvents();
      socket.disconnect();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    const handlePopstate = () => {
      socket.emit("leaveRoom", id, userNameFromState);
      socket.disconnect();
    };

    window.addEventListener("popstate", handlePopstate);

    socket.on("canvas-state-from-server", (state) => {
      removeUpdateEvents();
      editor.canvas.loadFromJSON(
        state,
        editor.canvas.renderAll.bind(editor.canvas)
      );
      addUpdateEvents();
    });

    socket.on("clear", () => {
      editor.canvas._objects.splice(0, editor.canvas._objects.length);
      history.splice(0, history.length);
      editor.canvas.renderAll();
    });

    socket.on("userLeft", ({ userName }) => {
      const leaveMessage = `${userName} leaves the room.`;
      setActions((prevActions) => [...prevActions, leaveMessage]);
      socket.on("participantsList", (participantsList) => {
        setParticipants(participantsList);
      });
      console.log(`${userName} left the room`);
    });

    return () => {
      removeUpdateEvents();
      window.removeEventListener("beforeunload", handleBeforeUnload);
      socket.off("canvas-state-from-server");
      socket.off("clear");
      socket.off("client-ready");
      socket.off("joinRoom");
      socket.off("userJoined");
      socket.off("leaveRoom");
      socket.off("userLeft");
      socket.off("participantsList");
      socket.off("participantsCount");
      socket.disconnect();
    };
  }, [editor, id, userNameFromState]);

  return (
    <div className="relative w-screen h-screen flex justify-center items-center">
      <AiOutlineUserSwitch
        className="absolute top-2 right-8 z-10 cursor-pointer text-black hover:text-blue-500 text-5xl"
        title="Room information"
        onClick={() => setIsRoomInfo(!isRoomInfo)}
      />
      {isRoomInfo && <RoomInfo participants={participants} actions={actions} />}

      <ToolPanel
        color={color}
        setColor={setColor}
        clear={clear}
        toggleDrawingMode={toggleDrawingMode}
        isDrawing={isDrawing}
        onSizeChange={onSizeChange}
        onAddLine={onAddLine}
        onAddCircle={onAddCircle}
        onAddRectangle={onAddRectangle}
        onAddTriangle={onAddTriangle}
        removeSelectedObject={removeSelectedObject}
        undo={undo}
        redo={redo}
        handleExportCanvas={handleExportCanvas}
      />
      <UserAmount userCount={userCount} />
      <FabricJSCanvas
        className="sample-canvas border h-screen w-screen "
        onReady={onReady}
      />
    </div>
  );
};

export default BoardPage;
