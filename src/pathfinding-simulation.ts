import "reflect-metadata"; //! THIS IMPORT MUST ALWAYS COME FIRST. BEWARE VSCODE AUTO IMPORT SORT!!!

import { mapSolidsQuadTree } from "@providers/inversify/container";
import { getAreaAroundCharacter } from "@providers/libs/getAreaAroundCharacter";

// 32x32 grid
mapSolidsQuadTree.init("unit-test-map-negative-coordinate", 0, 0, 32, 32);

// add some solids
mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 4, 15);
mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 3, 18);
mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 7, 17);
mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 11, 25);

const areaAroundCharacter = getAreaAroundCharacter(5, 17, 7, 7);

console.log("Area around character", areaAroundCharacter);

const result = mapSolidsQuadTree.getSolidsInArea("unit-test-map-negative-coordinate", areaAroundCharacter);

console.log(result);
