# A modular robot

These are the bindings that the project from Chapter 7 creates:

roads
buildGraph
roadGraph
VillageState
runRobot
randomPick
randomRobot
mailRoute
routeRobot
findRoute
goalOrientedRobot

If you were to write that project as a modular program, what modules would you create? Which module would depend on which other module, and what would their interfaces look like?

Which pieces are likely to be available prewritten on NPM? Would you prefer to use an NPM package or write them yourself?

# Roads module

Write a CommonJS module, based on the example from Chapter 7, that contains the array of roads and exports the graph data structure representing them as roadGraph. It should depend on a module ./graph, which exports a function buildGraph that is used to build the graph. This function expects an array of two-element arrays (the start and end points of the roads).
