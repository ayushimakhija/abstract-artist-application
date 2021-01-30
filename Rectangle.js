import Transform from "./transform.js";
import rotate from "./rotate.js";
import { vec4, vec3, mat4 } from "https://cdn.skypack.dev/gl-matrix";
export default class Rectangle {
  constructor(
    gl,
    centerX,
    centerY,
    width,
    height,
    count,
    flag,
    tx,
    ty,
    sx,
    sy
  ) {
    this.vertexAttributesData = new Float32Array([
      (centerX + width / 2 + tx) * sx,
      (centerY + height / 2 + ty) * sy,
      0.0,
      (centerX - width / 2 + tx) * sx,
      (centerY + height / 2 + ty) * sy,
      0.0,
      (centerX + width / 2 + tx) * sx,
      (centerY - height / 2 + ty) * sy,
      0.0,
      (centerX - width / 2 + tx) * sx,
      (centerY - height / 2 + ty) * sy,
      0.0,
    ]);

    this.gl = gl;
    this.width = width;
    this.count = count;
    this.height = height;
    this.centerX = centerX;
    this.centerY = centerY;
    this.flag = flag;
    this.tx = tx;
    this.ty = ty;
    this.sx = sx;
    this.sy = sy;

    this.vertexAttributesBuffer = this.gl.createBuffer();
    if (!this.vertexAttributesBuffer) {
      throw new Error("Buffer for vertex attributes could not be allocated");
    }
    this.transform = new Transform();
  }
  //getCenter(count) {
  // count = this.count;
  // return this.centerX, this.centerY;
  //}
  getX() {
    let maxx = this.centerX + this.width / 2;
    let minx = this.centerX - this.width / 2;
    return [maxx, minx];
  }
  getY() {
    let miny = this.centerY - this.height / 2;
    let maxy = this.centerY + this.height / 2;
    return [maxy, miny];
  }

  draw(shader) {
    let elementPerVertex = 3;
    const uModelTransformMatrix = shader.uniform("uModelTransformMatrix");

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexAttributesBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      this.vertexAttributesData,
      this.gl.DYNAMIC_DRAW
    );

    const aPosition = shader.attribute("aPosition");
    this.gl.enableVertexAttribArray(aPosition);
    this.gl.vertexAttribPointer(
      aPosition,
      elementPerVertex,
      this.gl.FLOAT,
      false,
      3 * this.vertexAttributesData.BYTES_PER_ELEMENT,
      0
    );

    const vColor = shader.uniform("vColor");
    shader.setUniform4f(vColor, new Float32Array([1.0, 0.0, 0.0, 1.0]));
    shader.setUniformMatrix4fv(
      uModelTransformMatrix,
      this.transform.getMVPMatrix()
    );

    this.gl.drawArrays(
      this.gl.TRIANGLE_STRIP,
      0,
      this.vertexAttributesData.length / elementPerVertex
    );
  }

  addVertex(position, color) {
    this.vertexAttributesData = new Float32Array([
      ...this.vertexAttributesData,
      ...position,
      ...color,
    ]);
  }
  getTransformedMatrixPositions() {
    // updated matrix
    const currentMatrix = mat4.fromValues(
      this.vertexAttributesData[0],
      this.vertexAttributesData[1],
      this.vertexAttributesBuffer[2],
      1,
      this.vertexAttributesBuffer[0] + this.width,
      this.vertexAttributesBuffer[1],
      this.vertexAttributesBuffer[2],
      1,
      this.vertexAttributesBuffer[0],
      this.vertexAttributesBuffer[1] + this.height,
      this.vertexAttributesBuffer[2],
      1,
      this.vertexAttributesBuffer[0] + this.width,
      this.vertexAttributesBuffer[1] + this.height,
      this.vertexAttributesBuffer[2],
      1
    );
    const updatedMatrixcopy = mat4.create();
    var updatedMatrix = mat4.create();
    mat4.copy(updatedMatrixcopy, currentMatrix);
    mat4.add(
      updatedMatrixcopy,
      updatedMatrixcopy,
      this.transform.getMVPMatrix()
    );
    console.log(updatedMatrixcopy);
    return updatedMatrixcopy;
  }
  getcentroidupdated(tx, ty) {
    let maxx = this.centerX + this.width / 2 + tx;
    let minx = this.centerX - this.width / 2 + tx;
    let miny = this.centerY - this.height / 2 + ty;
    let maxy = this.centerY + this.height / 2 + ty;
    let centerX = maxx + minx / 2;
    let centerY = maxy + miny / 2;
    return [centerX, centerY];
  }
}
