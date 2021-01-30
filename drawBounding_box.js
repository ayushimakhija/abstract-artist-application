import Transform from "./transform.js";
export default class Bounding_box {
  constructor(gl, box, flag) {
    this.gl = gl;
    this.flag = flag;
    this.box = box;

    this.vertexAttributesData = new Float32Array([
      box.bottomrightx,
      box.bottomrighty,
      0.0,
      box.toprightx,
      box.toprighty,
      0.0,
      box.bottomleftx,
      box.bottomlefty,
      0.0,
      box.topleftx,
      box.toplefty,
      0.0,
    ]);

    this.vertexAttributesBuffer = this.gl.createBuffer();
    if (!this.vertexAttributesBuffer) {
      throw new Error("Buffer for vertex attributes could not be allocated");
    }
    this.transform = new Transform();
  }

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
    shader.setUniform4f(vColor, new Float32Array([0.0, 1.0, 0.0, 1.0]));
    shader.setUniformMatrix4fv(
      uModelTransformMatrix,
      this.transform.getMVPMatrix()
    );

    this.gl.drawArrays(
      this.gl.LINES,
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
}
