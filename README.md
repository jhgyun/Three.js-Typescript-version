# Three.js-Typescript-version
Typescript version of Three.js 

The aim of this project is to convert original three.js to typescript style.

Original source https://github.com/mrdoob/three.js

#### Used Tools ####
Visualstudio 2015
Typescript 1.8 


#### generated file ####
three.js   
You can test it with original examples.

```html
...
var THREE; 
(function (THREE) {
    THREE.REVISION = '79';
    THREE.MOUSE = { LEFT: 0, MIDDLE: 1, RIGHT: 2 };
    THREE.CullFaceNone = 0;
    THREE.CullFaceBack = 1;
    THREE.CullFaceFront = 2;
    THREE.CullFaceFrontBack = 3;
    THREE.FrontFaceDirectionCW = 0;
    THREE.FrontFaceDirectionCCW = 1;
    THREE.BasicShadowMap = 0;
    THREE.PCFShadowMap = 1;
    THREE.PCFSoftShadowMap = 2;
    THREE.FrontSide = 0;
    THREE.BackSide = 1;
    THREE.DoubleSide = 2;
...
var THREE;
(function (THREE) {
    var Matrix3 = (function () {
        function Matrix3() {
            this.elements = new Float32Array([
                1, 0, 0,
                0, 1, 0,
                0, 0, 1
            ]);
        }
        Matrix3.prototype.set = function (n11, n12, n13, n21, n22, n23, n31, n32, n33) {
            var te = this.elements;
            te[0] = n11;
            te[1] = n21;
            te[2] = n31;
            te[3] = n12;
            te[4] = n22;
...
```
