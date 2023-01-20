import { MapArea } from "@providers/pathfinding/MapArea";
import { MapSolidsQuadTree } from "@providers/pathfinding/MapSolidsQuadTree";
import { PathfindingQuadTree } from "@providers/pathfinding/PathfindingQuadTree";
import { Container } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { ServerHelper } from "../server/ServerHelper";
import { controllersContainer } from "./ControllersInversify";

const container = new Container();

container.load(controllersContainer, buildProviderModule());

export const serverHelper = container.get<ServerHelper>(ServerHelper);

export const mapSolidsQuadTree = container.get(MapSolidsQuadTree);
export const pathfindingQuadTree = container.get(PathfindingQuadTree);
export const mapArea = container.get(MapArea);

export { container };
