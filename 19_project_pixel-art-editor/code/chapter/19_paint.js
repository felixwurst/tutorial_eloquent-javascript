/* ************************************************* The State ************************************************* */

var Picture = class Picture {
  constructor(width, height, pixels) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
  }
  static empty(width, height, color) {
    let pixels = new Array(width * height).fill(color);
    return new Picture(width, height, pixels);
  }
  pixel(x, y) {
    return this.pixels[x + y * this.width];
  }
  draw(pixels) {
    // slice without parameter is used to get a copy of the array
    let copy = this.pixels.slice();
    for (let {x, y, color} of pixels) {
      copy[x + y * this.width] = color;
    }
    return new Picture(this.width, this.height, copy);
  }
};

function updateState(state, action) {
  // state and action are copied into a new object
  return Object.assign({}, state, action);
}

/* ************************************************* DOM Building ************************************************* */

function elt(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (typeof child != 'string') dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}

/* ************************************************* The Canvas ************************************************* */

// This component is responsible for displaying an image and transmitting pointer events on this image to the rest of the application.

var scale = 10;

var PictureCanvas = class PictureCanvas {
  constructor(picture, pointerDown) {
    this.dom = elt('canvas', {
      onmousedown: event => this.mouse(event, pointerDown),
      ontouchstart: event => this.touch(event, pointerDown),
    });
    this.syncState(picture);
  }
  syncState(picture) {
    if (this.picture == picture) return;
    this.picture = picture;
    drawPicture(this.picture, this.dom, scale);
  }
};

function drawPicture(picture, canvas, scale) {
  canvas.width = picture.width * scale;
  canvas.height = picture.height * scale;
  let cx = canvas.getContext('2d');

  for (let y = 0; y < picture.height; y++) {
    for (let x = 0; x < picture.width; x++) {
      cx.fillStyle = picture.pixel(x, y);
      cx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
}

function pointerPosition(pos, domNode) {
  // position of the canvas on the screen
  let rect = domNode.getBoundingClientRect();
  return {
    x: Math.floor((pos.clientX - rect.left) / scale),
    y: Math.floor((pos.clientY - rect.top) / scale),
  };
}

PictureCanvas.prototype.mouse = function (downEvent, onDown) {
  // a key other than the left one is pressed
  if (downEvent.button != 0) return;
  let pos = pointerPosition(downEvent, this.dom);
  let onMove = onDown(pos);
  if (!onMove) return;
  let move = moveEvent => {
    // no more buttons are pressed
    if (moveEvent.buttons == 0) {
      this.dom.removeEventListener('mousemove', move);
    } else {
      let newPos = pointerPosition(moveEvent, this.dom);
      if (newPos.x == pos.x && newPos.y == pos.y) return;
      pos = newPos;
      onMove(newPos);
    }
  };
  this.dom.addEventListener('mousemove', move);
};

PictureCanvas.prototype.touch = function (startEvent, onDown) {
  let pos = pointerPosition(startEvent.touches[0], this.dom);
  let onMove = onDown(pos);
  // prevents the image from being rotated
  startEvent.preventDefault();
  if (!onMove) return;
  let move = moveEvent => {
    let newPos = pointerPosition(moveEvent.touches[0], this.dom);
    if (newPos.x == pos.x && newPos.y == pos.y) return;
    pos = newPos;
    onMove(newPos);
  };
  let end = () => {
    this.dom.removeEventListener('touchmove', move);
    this.dom.removeEventListener('touchend', end);
  };
  this.dom.addEventListener('touchmove', move);
  this.dom.addEventListener('touchend', end);
};

/* ************************************************* The Application ************************************************* */

var PixelEditor = class PixelEditor {
  constructor(state, config) {
    // tools: {draw: ƒ, fill: ƒ, rectangle: ƒ, pick: ƒ}
    // controls: [class ToolSelect, class ColorSelect, class SaveButton, class LoadButton, class UndoButton]
    // dispatch: ƒ dispatch(action) {
    //   state = historyUpdateState(state, action);
    //   app.syncState(state);
    // }
    let {tools, controls, dispatch} = config;
    // state {tool: 'draw', color: '#000000', picture: Picture, done: Array(0), doneAt: 0}
    this.state = state;

    this.canvas = new PictureCanvas(state.picture, pos => {
      // the selected tool returns a function
      let tool = tools[this.state.tool];
      // tools like draw and rectangle additionally return a callback function, so that they can still be used to draw lines incessantly or to change the rectangle dimensions dynamically
      let onMove = tool(pos, this.state, dispatch);
      if (onMove) return pos => onMove(pos, this.state);
    });
    this.controls = controls.map(Control => new Control(state, config));
    // div -> canvas -> br -> controls
    this.dom = elt(
      'div',
      {},
      this.canvas.dom,
      elt('br'),
      // [] = initial value
      ...this.controls.reduce((a, c) => a.concat(' ', c.dom), [])
    );
  }
  // from here, the other components, such as the canvas or the controls, are kept up to date
  syncState(state) {
    this.state = state;
    this.canvas.syncState(state.picture);
    for (let ctrl of this.controls) ctrl.syncState(state);
  }
};

var ToolSelect = class ToolSelect {
  constructor(state, {tools, dispatch}) {
    this.select = elt(
      'select',
      {
        onchange: () => dispatch({tool: this.select.value}),
      },
      ...Object.keys(tools).map(name =>
        elt(
          'option',
          {
            selected: name == state.tool,
          },
          name
        )
      )
    );
    // label -> select -> options
    this.dom = elt('label', null, '🖌 Tool: ', this.select);
  }
  syncState(state) {
    this.select.value = state.tool;
  }
};

var ColorSelect = class ColorSelect {
  constructor(state, {dispatch}) {
    this.input = elt('input', {
      type: 'color',
      value: state.color,
      onchange: () => dispatch({color: this.input.value}),
    });
    // label -> input
    this.dom = elt('label', null, '🎨 Color: ', this.input);
  }
  syncState(state) {
    this.input.value = state.color;
  }
};

/* ************************************************* Drawing Tools ************************************************* */

function draw(pos, state, dispatch) {
  function drawPixel({x, y}, state) {
    let drawn = {x, y, color: state.color};
    dispatch({picture: state.picture.draw([drawn])});
  }
  drawPixel(pos, state);
  return drawPixel;
}

function rectangle(start, state, dispatch) {
  function drawRectangle(pos) {
    let xStart = Math.min(start.x, pos.x);
    let yStart = Math.min(start.y, pos.y);
    let xEnd = Math.max(start.x, pos.x);
    let yEnd = Math.max(start.y, pos.y);
    let drawn = [];
    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        drawn.push({x, y, color: state.color});
      }
    }
    dispatch({picture: state.picture.draw(drawn)});
  }
  drawRectangle(start);
  return drawRectangle;
}

// the four pixels adjacent to the selected pixel
var around = [
  {dx: -1, dy: 0},
  {dx: 1, dy: 0},
  {dx: 0, dy: -1},
  {dx: 0, dy: 1},
];

function fill({x, y}, state, dispatch) {
  let targetColor = state.picture.pixel(x, y);
  let drawn = [{x, y, color: state.color}];
  for (let done = 0; done < drawn.length; done++) {
    for (let {dx, dy} of around) {
      let x = drawn[done].x + dx,
        y = drawn[done].y + dy;
      // If adjacent pixels are within the dimensions of the image, have the same colour as the source pixel and are not yet in the drawn array, they are placed there.
      if (
        x >= 0 &&
        x < state.picture.width &&
        y >= 0 &&
        y < state.picture.height &&
        state.picture.pixel(x, y) == targetColor &&
        !drawn.some(p => p.x == x && p.y == y)
      ) {
        drawn.push({x, y, color: state.color});
      }
    }
  }
  dispatch({picture: state.picture.draw(drawn)});
}

function pick(pos, state, dispatch) {
  dispatch({color: state.picture.pixel(pos.x, pos.y)});
}

/* ************************************************* Saving and Loading ************************************************* */

var SaveButton = class SaveButton {
  constructor(state) {
    this.picture = state.picture;
    this.dom = elt(
      'button',
      {
        onclick: () => this.save(),
      },
      '💾 Save'
    );
  }
  save() {
    // To create the image file, it draws the image at a scale of one pixel per pixel on a canvas element.
    let canvas = elt('canvas');
    drawPicture(this.picture, canvas, 10);
    let link = elt('a', {
      href: canvas.toDataURL(),
      download: 'pixelart.png',
    });
    // The link to the download is added to the document, a click on it is simulated and removed again.
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  syncState(state) {
    this.picture = state.picture;
  }
};

var LoadButton = class LoadButton {
  constructor(_, {dispatch}) {
    this.dom = elt(
      'button',
      {
        onclick: () => startLoad(dispatch),
      },
      '📁 Load'
    );
  }
  syncState() {}
};

function startLoad(dispatch) {
  let input = elt('input', {
    type: 'file',
    onchange: () => finishLoad(input.files[0], dispatch),
  });
  document.body.appendChild(input);
  input.click();
  input.remove();
}

function finishLoad(file, dispatch) {
  if (file == null) return;
  let reader = new FileReader();
  reader.addEventListener('load', () => {
    let image = elt('img', {
      onload: () =>
        dispatch({
          picture: pictureFromImage(image),
        }),
      src: reader.result,
    });
  });
  reader.readAsDataURL(file);
}

function pictureFromImage(image) {
  // the image size can be a maximum of 100 x 100 px
  let width = Math.min(100, image.width);
  let height = Math.min(100, image.height);
  let canvas = elt('canvas', {width, height});
  let cx = canvas.getContext('2d');
  cx.drawImage(image, 0, 0);
  let pixels = [];
  // reads the colour information of the image and creates an array in which each pixel receives four values (RGBA)
  let {data} = cx.getImageData(0, 0, width, height);

  function hex(n) {
    // toString(16) gives a string representation in hexadecimal notation
    // padStart adds a zero if necessary so that each number consists of two digits
    return n.toString(16).padStart(2, '0');
  }
  for (let i = 0; i < data.length; i += 4) {
    let [r, g, b] = data.slice(i, i + 3);
    pixels.push('#' + hex(r) + hex(g) + hex(b));
  }
  return new Picture(width, height, pixels);
}

/* ************************************************* Undo History ************************************************* */

function historyUpdateState(state, action) {
  // goes back one image
  if (action.undo == true) {
    if (state.done.length == 0) return state;
    return Object.assign({}, state, {
      picture: state.done[0],
      done: state.done.slice(1),
      doneAt: 0,
    });
    // previous image is saved if the last save was more than one second ago
  } else if (action.picture && state.doneAt < Date.now() - 1000) {
    return Object.assign({}, state, action, {
      done: [state.picture, ...state.done],
      doneAt: Date.now(),
    });
  } else {
    return Object.assign({}, state, action);
  }
}

var UndoButton = class UndoButton {
  constructor(state, {dispatch}) {
    this.dom = elt(
      'button',
      {
        onclick: () => dispatch({undo: true}),
        disabled: state.done.length == 0,
      },
      '⮪ Undo'
    );
  }
  syncState(state) {
    this.dom.disabled = state.done.length == 0;
  }
};

/* ************************************************* Let’s Draw ************************************************* */

var startState = {
  tool: 'draw',
  color: '#000000',
  picture: Picture.empty(50, 50, '#f0f0f0'),
  done: [],
  doneAt: 0,
};

var baseTools = {draw, fill, rectangle, pick};

var baseControls = [
  ToolSelect,
  ColorSelect,
  SaveButton,
  LoadButton,
  UndoButton,
];

function startPixelEditor({
  state = startState,
  tools = baseTools,
  controls = baseControls,
}) {
  let app = new PixelEditor(state, {
    tools,
    controls,
    dispatch(action) {
      state = historyUpdateState(state, action);
      app.syncState(state);
    },
  });
  return app.dom;
}
