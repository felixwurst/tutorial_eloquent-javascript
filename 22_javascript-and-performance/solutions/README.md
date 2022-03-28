# Finding paths

Write the findPath function, which, like the one in Chapter 7, attempts to find the shortest path between two nodes in a graph. It should take two GraphNode objects (like the one we used in this chapter) as arguments and return either null if no path is to be found, or an array of the nodes that represent a path through the graph. Nodes that are adjacent in this array are said to be connected by an edge.

A good algorithm for finding a path in a graph is as follows:

1. Create a worklist containing a single path, where this path again consists only of the starting node.
2. Start with the first path in the worklist.
3. If the node at the end of the current path is the destination node, return the path.
4. Otherwise, create a new path for each unexamined neighbor of the node at the end of the path (that is, for each neighbor that is not at the end of any of the paths in the worklist). To do this, add the neighbor to the current path and add it to the worklist.
5. If there are several paths in the worklist, go to the next path and continue with step 3.
6. Otherwise there is no path.

By fanning out from the start node, this procedure ensures that the destination node is always reached via the shortest path, since longer paths are not considered until the shorter ones have already been explored.

Implement this program and test it with some simple tree graphs. Construct a graph with a cyclic connection (e.g., using the connect method to add edges to a tree graph) and see if your function finds the shortest path when there are multiple possibilities.

# Timing

Use Date.now() to measure how long it takes your findPath function to find a path in a more complicated graph. Since treeGraph puts the root at the beginning of the graph array and a leaf at the end, you can give your function a nontrivial task in the following way:

```javascript
let graph = treeGraph(6, 6);
console.log(findPath(graph[0], graph[graph.length - 1]).length);
// → 6
```

Construct a test case with a runtime of about half a second. Be careful when passing larger numbers to treeGraph. Since the size of the graph increases exponentially, this can easily make the graph so large that it takes a lot of time and memory to find a path in it.

# Optimizing

Now that you have measurements for a test case, try to find ways to make findPath faster.

Consider both macro-optimization (doing less work) and micro-optimization (doing the given work in a less costly way). Also look for ways to use less memory and allocate fewer or smaller data structures.
