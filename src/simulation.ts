import { container } from "@providers/inversify/container";
import { GridQuadTreePathfinding } from "GridQuadtree";

const gridQuadtree = container.get(GridQuadTreePathfinding);

gridQuadtree.init("unit-test-map-negative-coordinate", 32, 32);
