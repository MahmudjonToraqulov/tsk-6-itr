import React from "react";
import { ClearOutlined, DownloadOutlined } from "@ant-design/icons";
import { InputNumber } from "antd";
import { BiUndo, BiRedo } from "react-icons/bi";
import { IoTriangleOutline } from "react-icons/io5";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegCircle } from "react-icons/fa";
import { BiRectangle } from "react-icons/bi";
import { BsBrush } from "react-icons/bs";
import ToolButton from "./ToolButton";

const ToolPanel = ({
  color,
  setColor,
  clear,
  toggleDrawingMode,
  isDrawing,
  onSizeChange,
  onAddLine,
  onAddCircle,
  onAddRectangle,
  onAddTriangle,
  removeSelectedObject,
  undo,
  redo,
  handleExportCanvas,
}) => {
  return (
    <div className="absolute top-0 left-0 flex flex-col justify-start items-center gap-3 mb-2 p-4 z-10">
      <ToolButton title="Select color">
        <label className="inline-block">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className=" h-9 w-9  hover:outline-blue-500" 
          />
        </label>
      </ToolButton>
      <ToolButton handleEvent={clear}>
        <ClearOutlined
          className="text-black hover:text-blue-500 text-3xl"
          title="Clear all"
        />
      </ToolButton>
      <ToolButton handleEvent={toggleDrawingMode}>
        <BsBrush
          className={`${
            isDrawing ? "text-blue-500" : "text-black"
          } text-3xl hover:text-blue-500`}
          title="Brush"
        />
      </ToolButton>
      {isDrawing && (
        <InputNumber
          size="small"
          min={1}
          max={10}
          defaultValue={3}
          onChange={onSizeChange}
          changeOnWheel
          className="hover:border-blue-500 w-12 border-transparent text-center focus:border-blue-500 transition-all duration-300"
        />
      )}
      <ToolButton handleEvent={onAddLine}>
        <div style={{ transform: "rotate(45deg)" }}>
          <TfiLayoutLineSolid
            className="text-black hover:text-blue-500 text-3xl"
            title="Line"
          />
        </div>
      </ToolButton>
      <ToolButton handleEvent={onAddCircle}>
        <FaRegCircle
          className="text-black hover:text-blue-500 text-3xl"
          title="Circle"
        />
      </ToolButton>
      <ToolButton handleEvent={onAddRectangle}>
        <BiRectangle
          className="text-black hover:text-blue-500 text-3xl"
          title="Rectangle"
        />
      </ToolButton>
      <ToolButton handleEvent={onAddTriangle}>
        <IoTriangleOutline
          className="text-black hover:text-blue-500 text-3xl"
          title="Triangle"
        />
      </ToolButton>
      <ToolButton handleEvent={removeSelectedObject}>
        <RiDeleteBinLine
          className="text-black hover:text-blue-500 text-3xl"
          title="Remove item"
        />
      </ToolButton>
      <div className="flex gap-1">
        <ToolButton handleEvent={undo}>
          <BiUndo
            className="text-black hover:text-blue-500 text-3xl"
            title="Undo"
          />
        </ToolButton>
        <ToolButton handleEvent={redo}>
          <BiRedo
            className="text-black hover:text-blue-500 text-3xl"
            title="Redo"
          />
        </ToolButton>
      </div>
      <ToolButton handleEvent={handleExportCanvas}>
        <DownloadOutlined
          className="text-black hover:text-blue-500 text-3xl"
          title="Export to JPEG"
        />
      </ToolButton>
    </div>
  );
};

export default ToolPanel;
