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

namespace THREE
{ 
    export type UniformType = SingleUniform | PureArrayUniform | StructuredUniform;
    export type ContainerUniformType = StructuredUniform | WebGLUniforms;

     // --- Uniform Classes --- 
    export class StructuredUniform
    {
        id;
        public seq: UniformType[] = [];
        public map: { [index: string]: UniformType } = {};

        constructor(id: any)
        {
            this.id = id;
            this.seq = [];
            this.map = {};
        };

        setValue(gl: WebGLRenderingContext, value, ...args)
        {
            // Note: Don't need an extra 'renderer' parameter, since samplers
            // are not allowed in structured uniforms. 
            var seq = this.seq;
            for (var i = 0, n = seq.length; i !== n; ++i)
            {
                var u = seq[i];
                u.setValue(gl, value[u.id]);
            }
        }
    }  
    export class SingleUniform
    {
        id;
        addr: WebGLUniformLocation;
        setValue: (gl: WebGLRenderingContext, value, ...args) => void;

        constructor(id, activeInfo, addr, singularSetter)
        {
            this.id = id;
            this.addr = addr;
            this.setValue = singularSetter;
            // this.path = activeInfo.name; // DEBUG 
        }
    } 
    export class PureArrayUniform
    {
        id;
        addr;
        size;
        setValue: (gl: WebGLRenderingContext, value, ...args) => void;
        constructor(id: any, activeInfo, addr, pureArraySetter)
        {
            this.id = id;
            this.addr = addr;
            this.size = activeInfo.size;
            this.setValue = pureArraySetter;
            // this.path = activeInfo.name; // DEBUG 
        }
    }
     
    export class WebGLUniforms
    { 
        private static emptyTexture = new Texture();
        private static emptyCubeTexture = new CubeTexture();
        private static arrayCacheF32: Float32Array[] = [];
        private static arrayCacheI32: Int32Array[] = [];

        public id;
        private gl;
        public seq: UniformType[] = [];
        public map: { [index: string]: UniformType } = {};
        private addr: WebGLUniformLocation;
        private size: number;
        private renderer: WebGLRenderer;
          
        constructor(gl: WebGLRenderingContext, program: _WebGLProgram, renderer: WebGLRenderer)
        { 
            this.seq = [];
            this.map = {};
            this.gl = gl;
            this.renderer = renderer;

            var n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

            for (var i = 0; i !== n; ++i)
            { 
                var info = gl.getActiveUniform(program, i);
                var path = info.name;
                var addr = gl.getUniformLocation(program, path);

                WebGLUniforms.parseUniform(info, addr, this); 
            } 
        };
         
        public setValue(gl: WebGLRenderingContext, name: string, value)
        {
            var u = this.map[name];
            if (u !== undefined) u.setValue(gl, value, this.renderer);
        }
        public set(gl: WebGLRenderingContext, object: any, name: string)
        {
            var u = this.map[name];
            if (u !== undefined) u.setValue(gl, object[name], this.renderer);
        }
        public setOptional(gl: WebGLRenderingContext, object: any, name: string)
        {
            var v = object[name];
            if (v !== undefined) this.setValue(gl, name, v);
        }

        public static upload(gl, seq, values, renderer)
        {
            for (var i = 0, n = seq.length; i !== n; ++i)
            {
                var u = seq[i],
                    v = values[u.id];

                if (v.needsUpdate !== false)
                {
                    // note: always updating when .needsUpdate is undefined

                    u.setValue(gl, v.value, renderer);
                }
            }
        };
        public static seqWithValue(seq: UniformType[], values)
        {
            var r = [];
            for (var i = 0, n = seq.length; i !== n; ++i)
            {
                var u = seq[i];
                if (u.id in values) r.push(u);
            }
            return r;
        }
        public static splitDynamic(seq, values)
        {
            var r = null,
                n = seq.length,
                w = 0;

            for (var i = 0; i !== n; ++i)
            {

                var u = seq[i],
                    v = values[u.id];

                if (v && v.dynamic === true)
                {

                    if (r === null) r = [];
                    r.push(u);
                }
                else
                {
                    // in-place compact 'seq', removing the matches
                    if (w < i) seq[w] = u;
                    ++w;
                }

            }

            if (w < n) seq.length = w;

            return r;

        }
        public static evalDynamic(seq, values, object, camera)
        {
            for (var i = 0, n = seq.length; i !== n; ++i)
            {
                var v = values[seq[i].id],
                    f = v.onUpdateCallback;
                if (f !== undefined) f.call(v, object, camera);
            }

        }
          
        // Array Caches (provide typed arrays for temporary by size)
        private static uncacheTemporaryArrays()
        {
            WebGLUniforms.arrayCacheF32.length = 0;
            WebGLUniforms.arrayCacheI32.length = 0;
        }

        // Flattening for arrays of vectors and matrices
        private static flatten(array: any[], nBlocks: number, blockSize: number): any
        {
            var arrayCacheF32 = WebGLUniforms.arrayCacheF32;

            var firstElem = array[0];
            if (firstElem <= 0 || firstElem > 0) return array;
            // unoptimized: ! isNaN( firstElem )
            // see http://jacksondunstan.com/articles/983

            var n = nBlocks * blockSize,
                r = arrayCacheF32[n];

            if (r === undefined)
            {
                r = new Float32Array(n);
                arrayCacheF32[n] = r;
            }

            if (nBlocks !== 0)
            {
                firstElem.toArray(r, 0);
                for (var i = 1, offset = 0; i !== nBlocks; ++i)
                {
                    offset += blockSize;
                    array[i].toArray(r, offset);
                }
            }
            return r;
        }

        // Texture unit allocation
        private static allocTexUnits(renderer, n: number)
        {
            var arrayCacheI32 = WebGLUniforms.arrayCacheI32;
            var r = arrayCacheI32[n];

            if (r === undefined)
            {
                r = new Int32Array(n);
                arrayCacheI32[n] = r;
            }

            for (var i = 0; i !== n; ++i)
                r[i] = renderer.allocTextureUnit();

            return r;
        }

        // --- Setters ---
        // Note: Defining these methods externally, because they come in a bunch
        // and this way their names minify.

        private static setValue1f = function (gl: WebGLRenderingContext, v: number) { gl.uniform1f(this.addr, v); }
        // Single scalar
        private static setValue1i = function (gl: WebGLRenderingContext, v: number) { gl.uniform1i(this.addr, v); }

        // Single float vector (from flat array or THREE.VectorN)
        private static setValue2fv = function (gl: WebGLRenderingContext, v: any)// Vector2 | Vector3 | Vector4 | Float32Array)
        {
            if (v.x === undefined) gl.uniform2fv(this.addr, v);
            else gl.uniform2f(this.addr, v.x, v.y);
        }

        private static setValue3fv = function (gl: WebGLRenderingContext, v: any)// Vector3 | Vector4 | Color | Float32Array)
        {
            if (v.x !== undefined)
                gl.uniform3f(this.addr, v.x, v.y, v.z);
            else if (v.r !== undefined)
                gl.uniform3f(this.addr, v.r, v.g, v.b);
            else
                gl.uniform3fv(this.addr, v);
        }
        private static setValue4fv = function (gl: WebGLRenderingContext, v: any)// Vector4 | Float32Array)
        {
            if (v.x === undefined) gl.uniform4fv(this.addr, v);
            else gl.uniform4f(this.addr, v.x, v.y, v.z, v.w);
        }

        // Single matrix (from flat array or MatrixN) 
        private static setValue2fm = function (gl: WebGLRenderingContext, v: any)// Matrix2  | Float32Array)
        {
            gl.uniformMatrix2fv(this.addr, false, v.elements || v);
        }

        private static setValue3fm = function (gl: WebGLRenderingContext, v: any)// Matrix3 | Float32Array)
        {
            gl.uniformMatrix3fv(this.addr, false, v.elements || v);
        }

        private static setValue4fm = function (gl: WebGLRenderingContext, v: any)// Matrix4 | Float32Array)
        {
            gl.uniformMatrix4fv(this.addr, false, v.elements || v);
        }

        // Single texture (2D / Cube)
        private static setValueT1 = function (gl: WebGLRenderingContext, v: any, renderer: WebGLRenderer)
        {
            var emptyTexture = WebGLUniforms.emptyTexture;
            var unit = renderer.allocTextureUnit();
            gl.uniform1i(this.addr, unit);
            renderer.setTexture2D(v || emptyTexture, unit);
        }

        private static setValueT6 = function (gl: WebGLRenderingContext, v: any, renderer: WebGLRenderer)
        {
            var emptyTexture = WebGLUniforms.emptyTexture;
            var unit = renderer.allocTextureUnit();
            gl.uniform1i(this.addr, unit);
            renderer.setTextureCube(v || WebGLUniforms.emptyCubeTexture, unit);

        }

        // Integer / Boolean vectors or arrays thereof (always flat arrays) 
        private static setValue2iv = function (gl: WebGLRenderingContext, v: Int32Array)
        {
            gl.uniform2iv(this.addr, v);
        }
        private static setValue3iv = function (gl: WebGLRenderingContext, v: Int32Array)
        {
            gl.uniform3iv(this.addr, v);
        }
        private static setValue4iv = function (gl: WebGLRenderingContext, v: Int32Array)
        {
            gl.uniform4iv(this.addr, v);
        }

        private static getSingularSetter(type: number)  
        {
            switch (type)
            {
                case 0x1406: return WebGLUniforms.setValue1f; // FLOAT
                case 0x8b50: return WebGLUniforms.setValue2fv; // _VEC2
                case 0x8b51: return WebGLUniforms.setValue3fv; // _VEC3
                case 0x8b52: return WebGLUniforms.setValue4fv; // _VEC4

                case 0x8b5a: return WebGLUniforms.setValue2fm; // _MAT2
                case 0x8b5b: return WebGLUniforms.setValue3fm; // _MAT3
                case 0x8b5c: return WebGLUniforms.setValue4fm; // _MAT4

                case 0x8b5e: return WebGLUniforms.setValueT1; // SAMPLER_2D
                case 0x8b60: return WebGLUniforms.setValueT6; // SAMPLER_CUBE

                case 0x1404: case 0x8b56: return WebGLUniforms.setValue1i; // INT, BOOL
                case 0x8b53: case 0x8b57: return WebGLUniforms.setValue2iv; // _VEC2
                case 0x8b54: case 0x8b58: return WebGLUniforms.setValue3iv; // _VEC3
                case 0x8b55: case 0x8b59: return WebGLUniforms.setValue4iv; // _VEC4 
            }
        }

        // Array of scalars 
        private static setValue1fv = function (gl: WebGLRenderingContext, v: Float32Array, renderer?: WebGLRenderer)
        {
            gl.uniform1fv(this.addr, v);
        };
        private static setValue1iv = function (gl: WebGLRenderingContext, v: Float32Array, renderer?: WebGLRenderer)
        {
            gl.uniform1iv(this.addr, v);
        };

        // Array of vectors (flat or from THREE classes) 
        private static setValueV2a = function (gl: WebGLRenderingContext, v: Vector2[], renderer?: WebGLRenderer)
        {
            gl.uniform2fv(this.addr, WebGLUniforms.flatten(v, this.size, 2));
        }

        private static setValueV3a = function (gl: WebGLRenderingContext, v: Vector3[], renderer?: WebGLRenderer)
        {
            gl.uniform3fv(this.addr, WebGLUniforms.flatten(v, this.size, 3));
        }
        private static setValueV4a = function (gl: WebGLRenderingContext, v: Vector4[], renderer?: WebGLRenderer)
        {
            gl.uniform4fv(this.addr, WebGLUniforms.flatten(v, this.size, 4));
        }

        // Array of matrices (flat or from THREE clases)

        private static setValueM2a = function (gl: WebGLRenderingContext, v, renderer?: WebGLRenderer)
        {
            gl.uniformMatrix2fv(this.addr, false, WebGLUniforms.flatten(v, this.size, 4));
        }
        private static setValueM3a = function (gl: WebGLRenderingContext, v: Matrix3[], renderer?: WebGLRenderer)
        {
            gl.uniformMatrix3fv(this.addr, false, WebGLUniforms.flatten(v, this.size, 9));
        }
        private static setValueM4a = function (gl: WebGLRenderingContext, v: Matrix4[], renderer?: WebGLRenderer)
        {
            gl.uniformMatrix4fv(this.addr, false, WebGLUniforms.flatten(v, this.size, 16));
        }

        // Array of textures (2D / Cube) 
        private static setValueT1a = function (gl: WebGLRenderingContext, v: Texture[], renderer: WebGLRenderer)
        {
            var n = v.length,
                units = WebGLUniforms.allocTexUnits(renderer, n);

            gl.uniform1iv(this.addr, units);
            for (var i = 0; i !== n; ++i)
            {
                renderer.setTexture2D(v[i] || WebGLUniforms.emptyTexture, units[i]);
            }
        }
        private static setValueT6a = function (gl: WebGLRenderingContext, v: CubeTexture[], renderer: WebGLRenderer)
        {
            var n = v.length,
                units = WebGLUniforms.allocTexUnits(renderer, n);

            gl.uniform1iv(this.addr, units);

            for (var i = 0; i !== n; ++i)
            {
                renderer.setTextureCube(v[i] || WebGLUniforms.emptyCubeTexture, units[i]);
            }
        }

        // Helper to pick the right setter for a pure (bottom-level) array 
        private static getPureArraySetter(type: number) 
        {
            switch (type)
            {
                case 0x1406: return WebGLUniforms.setValue1fv; // FLOAT
                case 0x8b50: return WebGLUniforms.setValueV2a; // _VEC2
                case 0x8b51: return WebGLUniforms.setValueV3a; // _VEC3
                case 0x8b52: return WebGLUniforms.setValueV4a; // _VEC4

                case 0x8b5a: return WebGLUniforms.setValueM2a; // _MAT2
                case 0x8b5b: return WebGLUniforms.setValueM3a; // _MAT3
                case 0x8b5c: return WebGLUniforms.setValueM4a; // _MAT4

                case 0x8b5e: return WebGLUniforms.setValueT1a; // SAMPLER_2D
                case 0x8b60: return WebGLUniforms.setValueT6a; // SAMPLER_CUBE

                case 0x1404: case 0x8b56: return WebGLUniforms.setValue1iv; // INT, BOOL
                case 0x8b53: case 0x8b57: return WebGLUniforms.setValue2iv; // _VEC2
                case 0x8b54: case 0x8b58: return WebGLUniforms.setValue3iv; // _VEC3
                case 0x8b55: case 0x8b59: return WebGLUniforms.setValue4iv; // _VEC4 
            }
        }

        // Parser - builds up the property tree from the path strings 
        private static RePathPart = /([\w\d_]+)(\])?(\[|\.)?/g;

        private static addUniform(container: ContainerUniformType, uniformObject: UniformType)
        {
            container.seq.push(uniformObject);
            container.map[uniformObject.id] = uniformObject;
        }

        private static parseUniform(
            activeInfo: WebGLActiveInfo,
            addr: WebGLUniformLocation,
            container: ContainerUniformType)
        {
            var path = activeInfo.name;
            var pathLength = path.length;

            // reset RegExp object, because of the early exit of a previous run
            var RePathPart = WebGLUniforms.RePathPart;
            var addUniform = WebGLUniforms.addUniform;

            RePathPart.lastIndex = 0;

            for (; ;)
            {
                var match = RePathPart.exec(path);
                var matchEnd = RePathPart.lastIndex;
                var id: any = match[1];
                var idIsIndex = match[2] === ']';
                var subscript = match[3];

                if (idIsIndex) id = id | 0; // convert to integer

                if (subscript === undefined ||
                    subscript === '[' && matchEnd + 2 === pathLength)
                {
                    // bare name or "pure" bottom-level array "[0]" suffix

                    addUniform(container, subscript === undefined ?
                        new SingleUniform(id, activeInfo, addr, WebGLUniforms.getSingularSetter(activeInfo.type)) :
                        new PureArrayUniform(id, activeInfo, addr, WebGLUniforms.getPureArraySetter(activeInfo.type)));
                    break;
                }
                else
                {
                    // step into inner node / create it in case it doesn't exist 
                    var map = container.map;
                    var next = map[id];

                    if (next === undefined)
                    {
                        next = new StructuredUniform(id);
                        addUniform(container, next);
                    }

                    container = next as StructuredUniform;
                }
            }
        }
    }
}
