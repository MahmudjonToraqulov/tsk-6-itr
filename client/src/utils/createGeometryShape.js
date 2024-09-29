import { fabric } from "fabric";

export const createGeometryShape = ({ canvas, shapeType, color }) => {
  const randomX = Math.random() * (canvas.width - 200);
  const randomY = Math.random() * (canvas.height - 100);

  const shapeOptions = {
    fill: "",
    stroke: color,
    strokeWidth: 3,
    left: randomX,
    top: randomY,
  };

  let shape;

  if (shapeType === "rect") {
    shape = new fabric.Rect({ ...shapeOptions, width: 200, height: 100 });
  } else if (shapeType === "circle") {
    shape = new fabric.Circle({
      ...shapeOptions,
      radius: 50,
    });
  } else if (shapeType === "line") {
    shape = new fabric.Line([randomX, randomY, randomX + 200, randomY + 100], {
      ...shapeOptions,
    });
  } else if (shapeType === "triangle") {
    shape = new fabric.Triangle({
      ...shapeOptions,
      width: 100,
      height: 100,
    });
  }

  return { shape };
};
