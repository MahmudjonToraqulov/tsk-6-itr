import React from "react";
import { Link } from "react-router-dom";
import EmptyCanvas from "../../assets/empty_canvas.jpeg";

const BoardItem = ({ board, index }) => {
  return (
    <div
      key={board._id}
      className="h-72 border border-blue-200 hover:scale-105 hover:shadow-lg shadow-sm rounded-lg overflow-hidden"
    >
      <Link to={`/boards/${board._id}`}>
        <div className="relative h-full  hover:shadow-md transition-transform duration-300">
          <img
            className="w-full"
            src={board.previewData || EmptyCanvas}
            alt={`Preview ${index}`}
          />
          <div className="absolute bottom-0 left-0 right-0 hover:bg-blue-600 bg-blue-600 bg-opacity-60 text-white text-center py-2">
            <span className="block font-bold">{board.name}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BoardItem;
