# Keyboard Bindings

Add keyboard shortcuts to the application. The first letter of a tool’s name selects the tool, and control-Z or command-Z activates undo.

Do this by modifying the PixelEditor component. Add a tabIndex property of 0 to the wrapping <div> element so that it can receive keyboard focus. Note that the property corresponding to the tabindex attribute is called tabIndex, with a capital I, and our elt function expects property names. Register the key event handlers directly on that element. This means you have to click, touch, or tab to the application before you can interact with it with the keyboard.

Remember that keyboard events have ctrlKey and metaKey (for the command key on Mac) properties that you can use to see whether those keys are held down.

# Efficient Drawing

During drawing, the majority of work that our application does happens in drawPicture. Creating a new state and updating the rest of the DOM isn’t very expensive, but repainting all the pixels on the canvas is quite a bit of work.

Find a way to make the syncState method of PictureCanvas faster by redrawing only the pixels that actually changed.

Remember that drawPicture is also used by the save button, so if you change it, either make sure the changes don’t break the old use or create a new version with a different name.

Also note that changing the size of a `<canvas>` element, by setting its width or height properties, clears it, making it entirely transparent again.

# Circles

Define a tool called circle that draws a filled circle when you drag. The center of the circle lies at the point where the drag or touch gesture starts, and its radius is determined by the distance dragged.

# Proper Lines

This is a more advanced exercise than the preceding two, and it will require you to design a solution to a nontrivial problem. Make sure you have plenty of time and patience before starting to work on this exercise, and do not get discouraged by initial failures.
On most browsers, when you select the draw tool and quickly drag across the picture, you don’t get a closed line. Rather, you get dots with gaps between them because the "mousemove" or "touchmove" events did not fire quickly enough to hit every pixel.
Improve the draw tool to make it draw a full line. This means you have to make the motion handler function remember the previous position and connect that to the current one.
To do this, since the pixels can be an arbitrary distance apart, you’ll have to write a general line drawing function.
A line between two pixels is a connected chain of pixels, as straight as possible, going from the start to the end. Diagonally adjacent pixels count as a connected. So a slanted line should look like the picture on the left, not the picture on the right.
Finally, if we have code that draws a line between two arbitrary points, we might as well use it to also define a line tool, which draws a straight line between the start and end of a drag.
