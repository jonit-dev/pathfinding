import { provide } from "inversify-binding-decorators";

import { GRID_HEIGHT, GRID_WIDTH } from "@constants/gridConstants";
import { FromGridX, FromGridY } from "@rpg-engine/shared";
import { Rectangle } from "@timohausmann/quadtree-ts";

export interface IMapArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

@provide(MapArea)
export class MapArea {
  public getAreaAroundCharacter = (
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
      x: FromGridX(zoneX),
      y: FromGridY(zoneY),
      width: FromGridX(zoneGridWidth),
      height: FromGridY(zoneGridHeight),
      qtIndex: Rectangle.prototype.qtIndex,
    };
  };
}
