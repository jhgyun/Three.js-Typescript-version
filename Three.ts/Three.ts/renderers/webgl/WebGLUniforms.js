/// <reference path="../../textures/cubetexture.ts" />
/*
 *
 * Uniforms of a program.
 * Those form a tree structure with a special top-level container for the root,
 * which you get by calling 'new WebGLUniforms( gl, program, renderer )'.
 *
 *
 * Properties of inner nodes including the top-level container:
 *
 * .seq - array of nested uniforms
 * .map - nested uniforms by name
 *
 *
 * Methods of all nodes except the top-level container:
 *
 * .setValue( gl, value, [renderer] )
 *
 * 		uploads a uniform value(s)
 *  	the 'renderer' parameter is needed for sampler uniforms
 *
 *
 * Static methods of the top-level container (renderer factorizations):
 *
 * .upload( gl, seq, values, renderer )
 *
 * 		sets uniforms in 'seq' to 'values[id].value'
 *
 * .seqWithValue( seq, values ) : filteredSeq
 *
 * 		filters 'seq' entries with corresponding entry in values
 *
 * .splitDynamic( seq, values ) : filteredSeq
 *
 * 		filters 'seq' entries with dynamic entry and removes them from 'seq'
 *
 *
 * Methods of the top-level container (renderer factorizations):
 *
 * .setValue( gl, name, value )
 *
 * 		sets uniform with  name 'name' to 'value'
 *
 * .set( gl, obj, prop )
 *
 * 		sets uniform from object and property with same name than uniform
 *
 * .setOptional( gl, obj, prop )
 *
 * 		like .set for an optional property of the object
 *
 *
 * @author tschw
 *
 */
var THREE;
(function (THREE) {
    // --- Uniform Classes --- 
    var StructuredUniform = (function () {
        function StructuredUniform(id) {
            this.seq = [];
            this.map = {};
            this.id = id;
            this.seq = [];
            this.map = {};
        }
        ;
        StructuredUniform.prototype.setValue = function (gl, value) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            // Note: Don't need an extra 'renderer' parameter, since samplers
            // are not allowed in structured uniforms. 
            var seq = this.seq;
            for (var i = 0, n = seq.length; i !== n; ++i) {
                var u = seq[i];
                u.setValue(gl, value[u.id]);
            }
        };
        return StructuredUniform;
    }());
    THREE.StructuredUniform = StructuredUniform;
    var SingleUniform = (function () {
        function SingleUniform(id, activeInfo, addr, singularSetter) {
            this.id = id;
            this.addr = addr;
            this.setValue = singularSetter;
            // this.path = activeInfo.name; // DEBUG 
        }
        return SingleUniform;
    }());
    THREE.SingleUniform = SingleUniform;
    var PureArrayUniform = (function () {
        function PureArrayUniform(id, activeInfo, addr, pureArraySetter) {
            this.id = id;
            this.addr = addr;
            this.size = activeInfo.size;
            this.setValue = pureArraySetter;
            // this.path = activeInfo.name; // DEBUG 
        }
        return PureArrayUniform;
    }());
    THREE.PureArrayUniform = PureArrayUniform;
    var WebGLUniforms = (function () {
        function WebGLUniforms(gl, program, renderer) {
            this.seq = [];
            this.map = {};
            this.seq = [];
            this.map = {};
            this.gl = gl;
            this.renderer = renderer;
            var n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
            for (var i = 0; i !== n; ++i) {
                var info = gl.getActiveUniform(program, i);
                var path = info.name;
                var addr = gl.getUniformLocation(program, path);
                WebGLUniforms.parseUniform(info, addr, this);
            }
        }
        ;
        WebGLUniforms.prototype.setValue = function (gl, name, value) {
            var u = this.map[name];
            if (u !== undefined)
                u.setValue(gl, value, this.renderer);
        };
        WebGLUniforms.prototype.set = function (gl, object, name) {
            var u = this.map[name];
            if (u !== undefined)
                u.setValue(gl, object[name], this.renderer);
        };
        WebGLUniforms.prototype.setOptional = function (gl, object, name) {
            var v = object[name];
            if (v !== undefined)
                this.setValue(gl, name, v);
        };
        WebGLUniforms.upload = function (gl, seq, values, renderer) {
            for (var i = 0, n = seq.length; i !== n; ++i) {
                var u = seq[i];
                var v = values[u.id];
                if (v.needsUpdate !== false) {
                    // note: always updating when .needsUpdate is undefined
                    u.setValue(gl, v.value, renderer);
                }
            }
        };
        ;
        WebGLUniforms.seqWithValue = function (seq, values) {
            var r = [];
            for (var i = 0, n = seq.length; i !== n; ++i) {
                var u = seq[i];
                if (u.id in values)
                    r.push(u);
            }
            return r;
        };
        WebGLUniforms.splitDynamic = function (seq, values) {
            var r = null, n = seq.length, w = 0;
            for (var i = 0; i !== n; ++i) {
                var u = seq[i], v = values[u.id];
                if (v && v.dynamic === true) {
                    if (r === null)
                        r = [];
                    r.push(u);
                }
                else {
                    // in-place compact 'seq', removing the matches
                    if (w < i)
                        seq[w] = u;
                    ++w;
                }
            }
            if (w < n)
                seq.length = w;
            return r;
        };
        WebGLUniforms.evalDynamic = function (seq, values, object, camera) {
            for (var i = 0, n = seq.length; i !== n; ++i) {
                var v = values[seq[i].id], f = v.onUpdateCallback;
                if (f !== undefined)
                    f.call(v, object, camera);
            }
        };
        // Array Caches (provide typed arrays for temporary by size)
        WebGLUniforms.uncacheTemporaryArrays = function () {
            WebGLUniforms.arrayCacheF32.length = 0;
            WebGLUniforms.arrayCacheI32.length = 0;
        };
        // Flattening for arrays of vectors and matrices
        WebGLUniforms.flatten = function (array, nBlocks, blockSize) {
            var arrayCacheF32 = WebGLUniforms.arrayCacheF32;
            var firstElem = array[0];
            if (firstElem <= 0 || firstElem > 0)
                return array;
            // unoptimized: ! isNaN( firstElem )
            // see http://jacksondunstan.com/articles/983
            var n = nBlocks * blockSize, r = arrayCacheF32[n];
            if (r === undefined) {
                r = new Float32Array(n);
                arrayCacheF32[n] = r;
            }
            if (nBlocks !== 0) {
                firstElem.toArray(r, 0);
                for (var i = 1, offset = 0; i !== nBlocks; ++i) {
                    offset += blockSize;
                    array[i].toArray(r, offset);
                }
            }
            return r;
        };
        // Texture unit allocation
        WebGLUniforms.allocTexUnits = function (renderer, n) {
            var arrayCacheI32 = WebGLUniforms.arrayCacheI32;
            var r = arrayCacheI32[n];
            if (r === undefined) {
                r = new Int32Array(n);
                arrayCacheI32[n] = r;
            }
            for (var i = 0; i !== n; ++i)
                r[i] = renderer.allocTextureUnit();
            return r;
        };
        WebGLUniforms.getSingularSetter = function (type) {
            switch (type) {
                case 0x1406: return WebGLUniforms.setValue1f; // FLOAT
                case 0x8b50: return WebGLUniforms.setValue2fv; // _VEC2
                case 0x8b51: return WebGLUniforms.setValue3fv; // _VEC3
                case 0x8b52: return WebGLUniforms.setValue4fv; // _VEC4
                case 0x8b5a: return WebGLUniforms.setValue2fm; // _MAT2
                case 0x8b5b: return WebGLUniforms.setValue3fm; // _MAT3
                case 0x8b5c: return WebGLUniforms.setValue4fm; // _MAT4
                case 0x8b5e: return WebGLUniforms.setValueT1; // SAMPLER_2D
                case 0x8b60: return WebGLUniforms.setValueT6; // SAMPLER_CUBE
                case 0x1404:
                case 0x8b56: return WebGLUniforms.setValue1i; // INT, BOOL
                case 0x8b53:
                case 0x8b57: return WebGLUniforms.setValue2iv; // _VEC2
                case 0x8b54:
                case 0x8b58: return WebGLUniforms.setValue3iv; // _VEC3
                case 0x8b55:
                case 0x8b59: return WebGLUniforms.setValue4iv; // _VEC4 
            }
        };
        // Helper to pick the right setter for a pure (bottom-level) array 
        WebGLUniforms.getPureArraySetter = function (type) {
            switch (type) {
                case 0x1406: return WebGLUniforms.setValue1fv; // FLOAT
                case 0x8b50: return WebGLUniforms.setValueV2a; // _VEC2
                case 0x8b51: return WebGLUniforms.setValueV3a; // _VEC3
                case 0x8b52: return WebGLUniforms.setValueV4a; // _VEC4
                case 0x8b5a: return WebGLUniforms.setValueM2a; // _MAT2
                case 0x8b5b: return WebGLUniforms.setValueM3a; // _MAT3
                case 0x8b5c: return WebGLUniforms.setValueM4a; // _MAT4
                case 0x8b5e: return WebGLUniforms.setValueT1a; // SAMPLER_2D
                case 0x8b60: return WebGLUniforms.setValueT6a; // SAMPLER_CUBE
                case 0x1404:
                case 0x8b56: return WebGLUniforms.setValue1iv; // INT, BOOL
                case 0x8b53:
                case 0x8b57: return WebGLUniforms.setValue2iv; // _VEC2
                case 0x8b54:
                case 0x8b58: return WebGLUniforms.setValue3iv; // _VEC3
                case 0x8b55:
                case 0x8b59: return WebGLUniforms.setValue4iv; // _VEC4 
            }
        };
        WebGLUniforms.addUniform = function (container, uniformObject) {
            container.seq.push(uniformObject);
            container.map[uniformObject.id] = uniformObject;
        };
        WebGLUniforms.parseUniform = function (activeInfo, addr, container) {
            var path = activeInfo.name;
            var pathLength = path.length;
            // reset RegExp object, because of the early exit of a previous run
            var RePathPart = WebGLUniforms.RePathPart;
            var addUniform = WebGLUniforms.addUniform;
            RePathPart.lastIndex = 0;
            for (;;) {
                var match = RePathPart.exec(path);
                var matchEnd = RePathPart.lastIndex;
                var id = match[1];
                var idIsIndex = match[2] === ']';
                var subscript = match[3];
                if (idIsIndex)
                    id = id | 0; // convert to integer
                if (subscript === undefined ||
                    subscript === '[' && matchEnd + 2 === pathLength) {
                    // bare name or "pure" bottom-level array "[0]" suffix
                    addUniform(container, subscript === undefined ?
                        new SingleUniform(id, activeInfo, addr, WebGLUniforms.getSingularSetter(activeInfo.type)) :
                        new PureArrayUniform(id, activeInfo, addr, WebGLUniforms.getPureArraySetter(activeInfo.type)));
                    break;
                }
                else {
                    // step into inner node / create it in case it doesn't exist 
                    var map = container.map;
                    var next = map[id];
                    if (next === undefined) {
                        next = new StructuredUniform(id);
                        addUniform(container, next);
                    }
                    container = next;
                }
            }
        };
        WebGLUniforms.emptyTexture = new THREE.Texture();
        WebGLUniforms.emptyCubeTexture = new THREE.CubeTexture();
        WebGLUniforms.arrayCacheF32 = [];
        WebGLUniforms.arrayCacheI32 = [];
        // --- Setters ---
        // Note: Defining these methods externally, because they come in a bunch
        // and this way their names minify.
        WebGLUniforms.setValue1f = function (gl, v) { gl.uniform1f(this.addr, v); }; // Single scalar
        WebGLUniforms.setValue1i = function (gl, v) { gl.uniform1i(this.addr, v); };
        // Single float vector (from flat array or THREE.VectorN)
        WebGLUniforms.setValue2fv = function (gl, v) {
            if (v.x === undefined)
                gl.uniform2fv(this.addr, v);
            else
                gl.uniform2f(this.addr, v.x, v.y);
        };
        WebGLUniforms.setValue3fv = function (gl, v) {
            if (v.x !== undefined)
                gl.uniform3f(this.addr, v.x, v.y, v.z);
            else if (v.r !== undefined)
                gl.uniform3f(this.addr, v.r, v.g, v.b);
            else
                gl.uniform3fv(this.addr, v);
        };
        WebGLUniforms.setValue4fv = function (gl, v) {
            if (v.x === undefined)
                gl.uniform4fv(this.addr, v);
            else
                gl.uniform4f(this.addr, v.x, v.y, v.z, v.w);
        };
        // Single matrix (from flat array or MatrixN) 
        WebGLUniforms.setValue2fm = function (gl, v) {
            gl.uniformMatrix2fv(this.addr, false, v.elements || v);
        };
        WebGLUniforms.setValue3fm = function (gl, v) {
            gl.uniformMatrix3fv(this.addr, false, v.elements || v);
        };
        WebGLUniforms.setValue4fm = function (gl, v) {
            gl.uniformMatrix4fv(this.addr, false, v.elements || v);
        };
        // Single texture (2D / Cube)
        WebGLUniforms.setValueT1 = function (gl, v, renderer) {
            var emptyTexture = WebGLUniforms.emptyTexture;
            var unit = renderer.allocTextureUnit();
            gl.uniform1i(this.addr, unit);
            renderer.setTexture2D(v || emptyTexture, unit);
        };
        WebGLUniforms.setValueT6 = function (gl, v, renderer) {
            var emptyTexture = WebGLUniforms.emptyTexture;
            var unit = renderer.allocTextureUnit();
            gl.uniform1i(this.addr, unit);
            renderer.setTextureCube(v || WebGLUniforms.emptyCubeTexture, unit);
        };
        // Integer / Boolean vectors or arrays thereof (always flat arrays) 
        WebGLUniforms.setValue2iv = function (gl, v) {
            gl.uniform2iv(this.addr, v);
        };
        WebGLUniforms.setValue3iv = function (gl, v) {
            gl.uniform3iv(this.addr, v);
        };
        WebGLUniforms.setValue4iv = function (gl, v) {
            gl.uniform4iv(this.addr, v);
        };
        // Array of scalars 
        WebGLUniforms.setValue1fv = function (gl, v, renderer) {
            gl.uniform1fv(this.addr, v);
        };
        WebGLUniforms.setValue1iv = function (gl, v, renderer) {
            gl.uniform1iv(this.addr, v);
        };
        // Array of vectors (flat or from THREE classes) 
        WebGLUniforms.setValueV2a = function (gl, v, renderer) {
            gl.uniform2fv(this.addr, WebGLUniforms.flatten(v, this.size, 2));
        };
        WebGLUniforms.setValueV3a = function (gl, v, renderer) {
            gl.uniform3fv(this.addr, WebGLUniforms.flatten(v, this.size, 3));
        };
        WebGLUniforms.setValueV4a = function (gl, v, renderer) {
            gl.uniform4fv(this.addr, WebGLUniforms.flatten(v, this.size, 4));
        };
        // Array of matrices (flat or from THREE clases)
        WebGLUniforms.setValueM2a = function (gl, v, renderer) {
            gl.uniformMatrix2fv(this.addr, false, WebGLUniforms.flatten(v, this.size, 4));
        };
        WebGLUniforms.setValueM3a = function (gl, v, renderer) {
            gl.uniformMatrix3fv(this.addr, false, WebGLUniforms.flatten(v, this.size, 9));
        };
        WebGLUniforms.setValueM4a = function (gl, v, renderer) {
            gl.uniformMatrix4fv(this.addr, false, WebGLUniforms.flatten(v, this.size, 16));
        };
        // Array of textures (2D / Cube) 
        WebGLUniforms.setValueT1a = function (gl, v, renderer) {
            var n = v.length, units = WebGLUniforms.allocTexUnits(renderer, n);
            gl.uniform1iv(this.addr, units);
            for (var i = 0; i !== n; ++i) {
                renderer.setTexture2D(v[i] || WebGLUniforms.emptyTexture, units[i]);
            }
        };
        WebGLUniforms.setValueT6a = function (gl, v, renderer) {
            var n = v.length, units = WebGLUniforms.allocTexUnits(renderer, n);
            gl.uniform1iv(this.addr, units);
            for (var i = 0; i !== n; ++i) {
                renderer.setTextureCube(v[i] || WebGLUniforms.emptyCubeTexture, units[i]);
            }
        };
        // Parser - builds up the property tree from the path strings 
        WebGLUniforms.RePathPart = /([\w\d_]+)(\])?(\[|\.)?/g;
        return WebGLUniforms;
    }());
    THREE.WebGLUniforms = WebGLUniforms;
})(THREE || (THREE = {}));
