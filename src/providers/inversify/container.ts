import { MapSolidsQuadTree } from "@providers/pathfinding/MapSolidsQuadTree";
import { Container } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { ServerHelper } from "../server/ServerHelper";
import { controllersContainer } from "./ControllersInversify";

const container = new Container();

container.load(controllersContainer, buildProviderModule());

export const serverHelper = container.get<ServerHelper>(ServerHelper);

export const mapSolidsQuadTree = container.get(MapSolidsQuadTree);

export { container };
