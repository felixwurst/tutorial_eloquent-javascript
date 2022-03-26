# Content Negotiation

One of the things HTTP can do is called content negotiation. The Accept request header is used to tell the server what type of document the client would like to get. Many servers ignore this header, but when a server knows of various ways to encode a resource, it can look at this header and send the one that the client prefers.

The URL https://eloquentjavascript.net/author is configured to respond with either plaintext, HTML, or JSON, depending on what the client asks for. These formats are identified by the standardized media types text/plain, text/html, and application/json.

Send requests to fetch all three formats of this resource. Use the headers property in the options object passed to fetch to set the header named Accept to the desired media type.

Finally, try asking for the media type application/rainbows+unicorns and see which status code that produces.

# A JavaScript Workbench

Build an interface that allows people to type and run pieces of JavaScript code.

Put a button next to a `<textarea>` field that, when pressed, uses the Function constructor we saw in Chapter 10 to wrap the text in a function and call it. Convert the return value of the function, or any error it raises, to a string and display it below the text field.

# Conway's Game Of Life

Conway’s Game of Life is a simple simulation that creates artificial “life” on a grid, each cell of which is either alive or not. Each generation (turn), the following rules are applied:

- Any live cell with fewer than two or more than three live neighbours dies.

- Any live cell with two or three live neighbours lives on to the next generation.

- Any dead cell with exactly three live neighbours becomes a live cell.

A neighbor is defined as any adjacent cell, including diagonally adjacent ones.

Note that these rules are applied to the whole grid at once, not one square at a time. That means the counting of neighbours is based on the situation at the start of the generation, and changes happening to neighbor cells during this generation should not influence the new state of a given cell.

Implement this game using whichever data structure you find appropriate. Use Math.random to populate the grid with a random pattern initially. Display it as a grid of checkbox fields, with a button next to it to advance to the next generation. When the user checks or unchecks the checkboxes, their changes should be included when computing the next generation.
