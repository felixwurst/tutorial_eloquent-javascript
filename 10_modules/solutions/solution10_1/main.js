import { VillageState, runRobot } from "./modules/state.js";
import { randomRobot, routeRobot, goalOrientedRobot } from "./modules/example-robot.js";

runRobot(VillageState.random(), goalOrientedRobot, []);