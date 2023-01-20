import { GRID_HEIGHT, GRID_WIDTH } from "@constants/gridConstants";
import { Rectangle } from "@timohausmann/quadtree-ts";

export interface ISocketTransmissionZone {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const getAreaAroundCharacter = (
  charGridX: number,
  charGridY: number,
  zoneGridWidth: number,
  zoneGridHeight: number
): Rectangle<void> => {
  // example: if zone width is 60 grid cells, we'd have 30 grid cells on each side of the entity as a zone
  // take into account gridOffsetX and gridOffsetY to support negative coordinates

  const zoneWidthHalf = Math.floor((zoneGridWidth * GRID_WIDTH) / 2 / GRID_WIDTH);
  const zoneHeightHalf = Math.floor((zoneGridHeight * GRID_HEIGHT) / 2 / GRID_HEIGHT);

  const zoneX = charGridX - zoneWidthHalf;
  const zoneY = charGridY - zoneHeightHalf;

  return {
    x: zoneX * GRID_WIDTH,
    y: zoneY * GRID_HEIGHT,
    width: zoneGridWidth * GRID_WIDTH,
    height: zoneGridHeight * GRID_HEIGHT,
    qtIndex: Rectangle.prototype.qtIndex,
  };
};
