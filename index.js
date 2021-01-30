import { vec3, mat4 } from "https://cdn.skypack.dev/gl-matrix";
import Shader from "./shader.js";
import vertexShaderSrc from "./vertex.js";
import fragmentShaderSrc from "./fragment.js";
import Renderer from "./renderer.js";
import Triangle from "./Square.js";
import Rectangle from "./Rectangle.js";
import Bounding_box from "./drawBounding_box.js";

let systemMode = -1;
let systemShape;
let transform;
let count = -1;
let pointsx = [];
let pointsy = [];
let currentrotation;
let centersx = [];
let centersy = [];
let bounds;
let centery;
let centerx;
let i = 0;
let centers = [];
let clipboards;
let count1;
let j = 0.0;
let flag1 = 0;
var Boundingbox;
let BBox = [];
window.addEventListener("keydown", function (event) {
  if (event.key === "m") {
    systemMode = systemMode + 1;
    systemMode = systemMode % 3;
    console.log(systemMode);
  }
  if (event.key === "r") {
    systemShape = "r";
    console.log(systemShape);
  }
  if (event.key === "s") {
    systemShape = "s";
    console.log(systemShape);
  }
});

const renderer = new Renderer();
const gl = renderer.webGlContext();

const shader = new Shader(gl, vertexShaderSrc, fragmentShaderSrc);
shader.use();
let currentPrimitive = -1;
const primitives = [];

// Convert mouse click to coordinate system as understood by webGL
renderer.getCanvas().addEventListener("click", (event) => {
  let mouseX = event.clientX;
  let mouseY = event.clientY;
  clipboards = renderer.mouseToClipCoord(mouseX, mouseY);
  if (systemMode === 0) {
    if (systemShape === "r") {
      count = count + 1;
      console.log(count);
      console.log("centers");
      console.log(clipboards[0]);
      console.log(clipboards[1]);
      var rectangle = new Rectangle(
        gl,
        clipboards[0],
        clipboards[1],
        0.25,
        0.5,
        count,
        flag1,
        0.0,
        0.0,
        1.0,
        1.0
      );
      primitives.push(rectangle);
      let x = rectangle.getX();
      let y = rectangle.getY();
      console.log(x[0]);
      console.log(x[1]);
      console.log(y[0]);
      console.log(y[1]);
      pointsx.push(x[0]);
      pointsx.push(x[1]);
      pointsy.push(y[0]);
      pointsy.push(y[1]);
      centersx.push(clipboards[0]);
      centersy.push(clipboards[1]);
      //rectangle.getTransformedVertexPositions();
      rectangle.getTransformedMatrixPositions();
      centers.push(clipboards[0]);
      centers.push(clipboards[1]);
      centers.push(count);
      systemShape = "n";
    }
    if (systemShape === "s") {
      count = count + 1;
      console.log(count);
      console.log("centers");
      console.log(clipboards[0]);
      console.log(clipboards[1]);
      var triangle = new Triangle(
        gl,
        clipboards[0],
        clipboards[1],
        0.25,
        0.25,
        count,
        flag1,
        0.0,
        0.0,
        1.0,
        1.0
      );
      primitives.push(triangle);
      let x = triangle.getX();
      let y = triangle.getY();
      console.log(x[0]);
      console.log(x[1]);
      console.log(y[0]);
      console.log(y[1]);
      pointsx.push(x[0]);
      pointsx.push(x[1]);
      pointsy.push(y[0]);
      pointsy.push(y[1]);
      centersx.push(clipboards[0]);
      centersy.push(clipboards[1]);
      triangle.getTransformedMatrixPositions();
      centers.push(clipboards[0]);
      centers.push(clipboards[1]);
      centers.push(count);
      systemShape = "n";
    }
  }
});
let translation = vec3.create();
let scale = vec3.create();
let rotationAngle = 0.0;
let rotationAxis = vec3.create();

const transformSettings = {
  scale: 1.0,
  translateX: 0.0,
  translateY: 0.0,
  rotationAngle: 0.0,
};
renderer.getCanvas().addEventListener("click", (event) => {
  let mouseX = event.clientX;
  let mouseY = event.clientY;
  let clipboards = renderer.mouseToClipCoord(mouseX, mouseY);
  let distance = [];
  if (systemMode === 1 || systemMode === 2) {
    for (let j = 0; j < centers.length; j = j + 3) {
      console.log("looprun");
      let mincenter = Math.abs(Math.abs(centers[j] - clipboards[0]));

      let maxcenter = Math.abs(Math.abs(centers[j + 1] - clipboards[1]));

      let distances = Math.sqrt((mincenter ^ 2) + (maxcenter ^ 2));
      console.log(distances);
      distance.push(Math.sqrt((mincenter ^ 2) + (maxcenter ^ 2)));
    }
    let min = Math.min(...distance);
    for (let k = 0; k < centers.length; k = k + 3) {
      let mincenter = Math.abs(Math.abs(centers[k] - clipboards[0]));
      let maxcenter = Math.abs(Math.abs(centers[k + 1] - clipboards[1]));

      console.log(mincenter);
      console.log(maxcenter);
      let min1 = Math.sqrt((mincenter ^ 2) + (maxcenter ^ 2));
      if (min === min1) {
        count1 = centers[k + 2];
        console.log("values of count");
        console.log(centers[k + 2]);
        console.log(min);
        console.log(min1);
        console.log(count1);
        break;
      }
    }
  }
});
let k = 0;
let k1 = 0;
window.addEventListener("keydown", function (event) {
  if (systemMode === 1 || systemMode === 2) {
    switch (event.key) {
      case "ArrowDown":
        currentrotation = "t";
        transformSettings.translateY = transformSettings.translateY - k;
        i = k - 0.1;
        console.log("t");
        break;
      case "ArrowUp":
        currentrotation = "t";
        //transformSettings.translateY, -1.0, 0.0;
        transformSettings.translateY = transformSettings.translateY + k;
        k = k + 0.1;
        console.log("t");
        break;
      case "ArrowLeft":
        currentrotation = "t";
        transformSettings.translateX = transformSettings.translateX + k1;
        k1 = k1 - 0.1;
        console.log("t");
        //transformSettings, "translateX", -1.0, 0.0;
        break;
      case "ArrowRight":
        currentrotation = "t";
        transformSettings.translateX = transformSettings.translateX - k1;
        k1 = k1 + 0.1;
        console.log("t");
        //transformSettings, "translateX", 0.0, 1.0;
        break;

      case "+":
        transformSettings.scale = transformSettings.scale + j;
        j = j + 0.1;
        console.log("+");
        currentrotation = "s";
        break;
      case "t":
        transformSettings.scale = transformSettings.scale - j;
        j = j - 0.1;
        console.log("-");
        currentrotation = "s";
        break;
    }
  }
  //Bounding boxs;
  const box = {
    topleftx: 0,
    toplefty: 0,
    toprightx: 0,
    toprighty: 0,
    bottomleftx: 0,
    bottomlefty: 0,
    bottomrightx: 0,
    bottomrighty: 0,
  };

  function bounding_box(pointsx, pointsy) {
    let xmin = Math.min(...pointsx);
    let xmax = Math.max(...pointsx);
    let ymin = Math.min(...pointsy);
    let ymax = Math.max(...pointsy);
    console.log("xmin");
    console.log(xmin);
    console.log("xmax");
    console.log(xmax);
    console.log("ymin");
    console.log(ymin);
    console.log("ymax");
    console.log(ymax);

    box.topleftx = box.topleftx + xmin;
    box.toplefty = box.toplefty + ymin;
    box.toprightx = box.toprightx + xmax;
    box.toprighty = box.toprighty + ymax;
    box.bottomleftx = box.bottomleftx + xmin;
    box.bottomlefty = box.bottomlefty + ymax;
    box.bottomrightx = box.bottomrightx + xmax;
    box.bottomrighty = box.bottomrighty + ymin;

    return box;
  }
  // rotations
  if (systemMode === 2) {
    switch (event.key) {
      case "l":
        currentrotation = "r";
        if (i < Math.PI) transformSettings.rotationAngle = i;
        i = i + 0.01;
        console.log("rotation");
        break;
      case "b":
        let box = bounding_box(pointsx, pointsy);
        let centerx = box.topleftx + box.toprightx / 2;
        let centery = box.toprighty + box.toplefty / 2;
        console.log(centerx);
        console.log(centery);
        Boundingbox = new Bounding_box(gl, box, 0);
        BBox.push(Boundingbox);
        break;
      case "p":
        currentrotation = "r";
        if (i < Math.PI) transformSettings.rotationAngle = i;
        i = i - 0.01;
        console.log("rotation");
        break;
      case "e":
        console.log("closedproject");
        window.location.href = "./closedproject.html";
        break;
      case "o":
        console.log("reload the application");
        window.location.herf = "./index.html";
        break;
    }
  }
});

//screen shot

document.getElementById("screenshort").addEventListener("click", function () {
  const canvas = renderer.getCanvas();
  //canvas.getContext("webgl", { preserveDrawingBuffer: true });
  animate();
  if (systemMode === 2) {
    canvas.toBlob((blob) => {
      saveBlob(blob, `screencapture-${canvas.width}x${canvas.height}.png`);
    });
  }
});

const saveBlob = (function () {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style.display = "none";
  return function saveData(blob, fileName) {
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
  };
})();
let flag = 0;
function animate() {
  renderer.clear();
  primitives.forEach((primitive, index) => {
    if (systemMode == 1 || systemMode == 2) {
      if (index === count1) {
        if (currentrotation === "t") {
          //console.log(primitive.count);
          vec3.set(
            translation,
            transformSettings.translateX,
            transformSettings.translateY,
            0
          );
          primitive.transform.setTranslate(translation);
          primitive.tx = transformSettings.translateX;
          primitive.ty = transformSettings.translateY;
          let centeroids = primitive.getcentroidupdated(
            transformSettings.translateX,
            transformSettings.translateY
          );
          for (let i = 0; i < centers.length; i = i + 3) {
            if (centers[i + 2] == count1) {
              centers[i] = centeroids[0];
              centers[i + 1] = centeroids[1];
            }
          }
          primitive.transform.updateMVPMatrix();
          // primitive.getTransformedMatrixPositions();
        }
        if (currentrotation === "s") {
          vec3.set(translation, -primitive.centerX, -primitive.centerY, 0);
          vec3.set(scale, transformSettings.scale, transformSettings.scale, 1);
          primitive.tx = transformSettings.translateX;
          primitive.ty = transformSettings.translateY;
          primitive.transform.updateMVPMatrix();
          primitive.transform.setScale(scale);
          vec3.set(scale, transformSettings.scale, transformSettings.scale, 1);
          primitive.sx = transformSettings.scale;
          primitive.sy = transformSettings.scale;
          primitive.transform.updateMVPMatrix();
          vec3.set(translation, primitive.centerX, primitive.centerY, 0);
          primitive.tx = transformSettings.translateX;
          primitive.ty = transformSettings.translateY;
          primitive.getcentroidupdated(
            transformSettings.translateX,
            transformSettings.translateY
          );
          primitive.transform.updateMVPMatrix();
          //primitive.getTransformedMatrixPositions();
        }
      }

      /* if (systemMode === 2) {
        if (currentrotation === "r") {
          vec3.set(translation, -centerx, -centery, 0);
          primitive.transform.setTranslate(translation);
          // primitive.transform.updateMVPMatrix();

          vec3.set(rotationAxis, 0, 0, 1);
          primitive.transform.setRotate(
            rotationAxis,
            transformSettings.rotationAngle
          );
          rotationAngle = +0.01;
          if (rotationAngle > Math.PI) rotationAngle = 0;

          primitive.transform.updateMVPMatrix();
          vec3.set(translation, centerx, centery, 0);
          primitive.transform.setTranslate(translation);
          //primitive.tranform.updateMVPMatrix();
        }
        //primitive.getTransformedMatrixPositions();
      }*/
    }
    window.addEventListener("keydown", function (event) {
      if (systemMode === 1) {
        switch (event.key) {
          case "Delete":
            if (index == count1) {
              for (let i = 0; i < centers.length; i = i + 3) {
                if (centers[i + 2] == count1) {
                  centers.splice(i, i + 3);
                }
              }
              del();
            }
        }
      }
    });

    function del() {
      primitive.flag = 1;
    }
    if (primitive.flag == 0) {
      primitive.draw(shader);
    }
  });
  if (systemMode === 2) {
    BBox.forEach((Bounding, index) => {
      //console.log("bounding box");
      if (Bounding.flag === 0) {
        Bounding.draw(shader);
        //Bounding.flag = 1;

        if (currentrotation === "r") {
          /*vec3.set(translation, -centerx, -centery, 0);
          Bounding.transform.setTranslate(translation);
          Bounding.transform.updateMVPMatrix();*/

          vec3.set(rotationAxis, 0, 0, 1);
          Bounding.transform.setRotate(
            rotationAxis,
            transformSettings.rotationAngle
          );
          /* Bounding.transform.updateMVPMatrix();*/
          primitives.forEach((primitive, index) => {
            vec3.set(translation, -primitive.centerX, -primitive.centerY, 0);
            primitive.transform.setTranslate(translation);
            primitive.transform.updateMVPMatrix();
            vec3.set(rotationAxis, 0, 0, 1);
            primitive.transform.setRotate(
              rotationAxis,
              transformSettings.rotationAngle
            );
            primitive.transform.updateMVPMatrix();
            vec3.set(translation, primitive.centerX, primitive.centerY, 0);
            primitive.transform.setTranslate(translation);
            primitive.transform.updateMVPMatrix();
          });

          rotationAngle = +0.01;
          if (rotationAngle > Math.PI) rotationAngle = 0;

          //Bounding.transform.updateMVPMatrix();
          vec3.set(translation, centerx, centery, 0);
          Bounding.transform.setTranslate(translation);
          Bounding.transform.updateMVPMatrix();
        }
      }
    });
    //primitive.getTransformedMatrixPositions();
  }

  window.requestAnimationFrame(animate);
}

animate();
shader.delete();
