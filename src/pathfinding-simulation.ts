import "reflect-metadata"; //! THIS IMPORT MUST ALWAYS COME FIRST. BEWARE VSCODE AUTO IMPORT SORT!!!

import "dotenv/config";

import { GRID_HEIGHT, GRID_WIDTH } from "@constants/gridConstants";
import { gridQuadTreePathfinding } from "@providers/inversify/container";
import { getAreaAroundCharacter } from "@providers/libs/getAreaAroundCharacter";

console.log(GRID_WIDTH, GRID_HEIGHT);

// 32x32 grid
gridQuadTreePathfinding.init("unit-test-map-negative-coordinate", 32, 32);

// add some solids
gridQuadTreePathfinding.addSolid("unit-test-map-negative-coordinate", -10, 10);
gridQuadTreePathfinding.addSolid("unit-test-map-negative-coordinate", -5, 10);

gridQuadTreePathfinding.addSolid("unit-test-map-negative-coordinate", -9, 12);
gridQuadTreePathfinding.addSolid("unit-test-map-negative-coordinate", -10, 15);
gridQuadTreePathfinding.addSolid("unit-test-map-negative-coordinate", -7, 16);

const areaAroundCharacter = getAreaAroundCharacter(-8, 17, 7, 7);

const result = gridQuadTreePathfinding.getSolidsInArea("unit-test-map-negative-coordinate", areaAroundCharacter);

console.log(result);
