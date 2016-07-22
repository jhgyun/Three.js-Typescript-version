/// <reference path="../core/eventdispatcher.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

namespace THREE
{
    export interface IMaterialParams
    {
        color?: number; // <hex>,
        specular?: number; // <hex>,
        shininess?: number; // <float>,
        opacity?: number; // <float>,
        shading?: number;
        map?: Texture; // new THREE.Texture(<Image> ),

        lightMap?: Texture; // new THREE.Texture(<Image> ),
        lightMapIntensity?: number; // <float>

        aoMap?: Texture; // new THREE.Texture(<Image> ),
        aoMapIntensity?: number; // <float>

        emissive?: number; // <hex>,
        emissiveIntensity?: number; // <float>
        emissiveMap?: Texture; // new THREE.Texture(<Image> ),

        bumpMap?: Texture; // new THREE.Texture(<Image> ),
        bumpScale?: number; // <float>,

        normalMap?: Texture; // new THREE.Texture(<Image> ),
        normalScale?: number; // <Vector2>,

        displacementMap?: Texture; // new THREE.Texture(<Image> ),
        displacementScale?: number; // <float>,
        displacementBias?: number; // <float>,

        specularMap?: Texture; // new THREE.Texture(<Image> ),

        alphaMap?: Texture; // new THREE.Texture(<Image> ),

        envMap?: CubeTexture; // new THREE.TextureCube([posx, negx, posy, negy, posz, negz]),
        envMapIntensity?: number; // <float>  

        combine?: number; // THREE.Multiply,
        reflectivity?: number; // <float>,
        refractionRatio?: number; // <float>,

        wireframe?: boolean; // <boolean>,
        wireframeLinewidth?: number; // <float>,

        skinning?: boolean; // <bool>,
        morphTargets?: boolean; // <bool>,
        morphNormals?: boolean; // <bool> 


        roughnessMap?: Texture; // new THREE.Texture(<Image> ), 
        roughness?: number; // <float>,
        metalnessMap?: Texture; // new THREE.Texture(<Image> ),  
        metalness?: number; // <float>,  
        vertexColors?: number;
        transparent?: boolean;
          
        depthTest?: boolean; // <bool>,
        depthWrite?: boolean; // <bool>, 
        fog?: boolean;
    }

  

    export class Material extends EventDispatcher
        implements IMaterial
    {
        private _id = MaterialIdCount++;

        get id()
        {
            return this._id;
        }

        uuid = Math.generateUUID();
        name = '';
        type = 'Material';
        fog = true;
        lights = true;
        blending = NormalBlending;
        side = FrontSide;

        /**
        * THREE.FlatShading, THREE.SmoothShading
        */
        shading = SmoothShading;
        /**
        * THREE.NoColors, THREE.VertexColors, THREE.FaceColors
        */
        vertexColors = NoColors;
        opacity = 1;
        transparent = false;
        blendSrc = SrcAlphaFactor;

        blendDst = OneMinusSrcAlphaFactor;
        blendEquation = AddEquation;
        blendSrcAlpha = null;
        blendDstAlpha = null;
        blendEquationAlpha = null;

        depthFunc = LessEqualDepth;
        depthTest = true;
        depthWrite = true;

        clippingPlanes: Plane[] = null;
        clipShadows = false;

        colorWrite = true;

        precision = null; // override the renderer's default precision for this material

        polygonOffset = false;
        polygonOffsetFactor = 0;
        polygonOffsetUnits = 0;

        alphaTest = 0;
        premultipliedAlpha = false;

        overdraw = 0; // Overdrawn pixels (typically between 0 and 1) for fixing antialiasing gaps in CanvasRenderer

        visible = true;
        _needsUpdate = true;

        color: Color;
        roughness: number;
        metalness: number;
        emissive: Color;
        specular: Color;
        shininess: number;
        map: Texture;
        alphaMap: Texture;
        lightMap: Texture;
        bumpMap: Texture;
        bumpScale: number;
        normalMap: Texture;
        normalScale: Vector2;
        displacementMap: Texture;
        displacementScale: number;
        displacementBias: number;
        roughnessMap: Texture;
        metalnessMap: Texture;
        emissiveMap: Texture;
        specularMap: Texture;
        envMap: Texture;
        reflectivity: number;
        size: number;
        sizeAttenuation: boolean;
        wireframe: boolean;
        wireframeLinewidth: number;
        clipping: boolean; 
        uniforms: any;

        constructor()
        {
            super();
        };


        get needsUpdate()
        {
            return this._needsUpdate;
        }
        set needsUpdate(value)
        {
            if (value === true) this.update();
            this._needsUpdate = value;
        }

        setValues(values)
        {
            if (values === undefined) return;

            for (var key in values)
            {
                var newValue = values[key];
                if (newValue === undefined)
                {
                    console.warn("THREE.Material: '" + key + "' parameter is undefined.");
                    continue;
                }

                var currentValue = this[key];

                if (currentValue === undefined)
                {
                    console.warn("THREE." + this.type + ": '" + key + "' is not a property of this material.");
                    continue;
                }

                if (currentValue instanceof Color)
                {
                    currentValue.set(newValue);

                }
                else if (currentValue instanceof Vector3 && newValue instanceof Vector3)
                {
                    currentValue.copy(newValue);
                }
                else if (key === 'overdraw')
                {
                    // ensure overdraw is backwards-compatible with legacy boolean type
                    this[key] = Number(newValue);
                }
                else
                {
                    this[key] = newValue;
                }
            }
        }

        toJSON(meta)
        {
            var isRoot = meta === undefined;

            if (isRoot)
            {
                meta = {
                    textures: {},
                    images: {}
                };
            }
            var data: any = {
                metadata: {
                    version: 4.4,
                    type: 'Material',
                    generator: 'Material.toJSON'
                }
            };

            // standard Material serialization
            data.uuid = this.uuid;
            data.type = this.type;

            if (this.name !== '') data.name = this.name;

            if (this.color instanceof Color) data.color = this.color.getHex();

            if (this.roughness !== undefined) data.roughness = this.roughness;
            if (this.metalness !== undefined) data.metalness = this.metalness;

            if (this.emissive instanceof Color) data.emissive = this.emissive.getHex();
            if (this.specular instanceof Color) data.specular = this.specular.getHex();
            if (this.shininess !== undefined) data.shininess = this.shininess;

            if (this.map instanceof Texture) data.map = this.map.toJSON(meta).uuid;
            if (this.alphaMap instanceof Texture) data.alphaMap = this.alphaMap.toJSON(meta).uuid;
            if (this.lightMap instanceof Texture) data.lightMap = this.lightMap.toJSON(meta).uuid;
            if (this.bumpMap instanceof Texture)
            {
                data.bumpMap = this.bumpMap.toJSON(meta).uuid;
                data.bumpScale = this.bumpScale;
            }
            if (this.normalMap instanceof Texture)
            {
                data.normalMap = this.normalMap.toJSON(meta).uuid;
                data.normalScale = this.normalScale.toArray();
            }
            if (this.displacementMap instanceof Texture)
            {
                data.displacementMap = this.displacementMap.toJSON(meta).uuid;
                data.displacementScale = this.displacementScale;
                data.displacementBias = this.displacementBias;

            }
            if (this.roughnessMap instanceof Texture) data.roughnessMap = this.roughnessMap.toJSON(meta).uuid;
            if (this.metalnessMap instanceof Texture) data.metalnessMap = this.metalnessMap.toJSON(meta).uuid;

            if (this.emissiveMap instanceof Texture) data.emissiveMap = this.emissiveMap.toJSON(meta).uuid;
            if (this.specularMap instanceof Texture) data.specularMap = this.specularMap.toJSON(meta).uuid;

            if (this.envMap instanceof Texture)
            {
                data.envMap = this.envMap.toJSON(meta).uuid;
                data.reflectivity = this.reflectivity; // Scale behind envMap 
            }

            if (this.size !== undefined) data.size = this.size;
            if (this.sizeAttenuation !== undefined) data.sizeAttenuation = this.sizeAttenuation;

            if (this.blending !== NormalBlending) data.blending = this.blending;
            if (this.shading !== SmoothShading) data.shading = this.shading;
            if (this.side !== FrontSide) data.side = this.side;
            if (this.vertexColors !== NoColors) data.vertexColors = this.vertexColors;

            if (this.opacity < 1) data.opacity = this.opacity;
            if (this.transparent === true) data.transparent = this.transparent;
            if (this.alphaTest > 0) data.alphaTest = this.alphaTest;
            if (this.premultipliedAlpha === true) data.premultipliedAlpha = this.premultipliedAlpha;
            if (this.wireframe === true) data.wireframe = this.wireframe;
            if (this.wireframeLinewidth > 1) data.wireframeLinewidth = this.wireframeLinewidth;

            // TODO: Copied from Object3D.toJSON

            function extractFromCache(cache)
            {
                var values = [];
                for (var key in cache)
                {
                    var data = cache[key];
                    delete data.metadata;
                    values.push(data);

                }
                return values;
            }

            if (isRoot)
            {
                var textures = extractFromCache(meta.textures);
                var images = extractFromCache(meta.images);

                if (textures.length > 0) data.textures = textures;
                if (images.length > 0) data.images = images;
            }
            return data;

        }

        clone(): this
        {
            return new (this.constructor as any)().copy(this);
        }

        copy(source: Material): this
        {
            this.name = source.name;

            this.fog = source.fog;
            this.lights = source.lights;

            this.blending = source.blending;
            this.side = source.side;
            this.shading = source.shading;
            this.vertexColors = source.vertexColors;

            this.opacity = source.opacity;
            this.transparent = source.transparent;

            this.blendSrc = source.blendSrc;
            this.blendDst = source.blendDst;
            this.blendEquation = source.blendEquation;
            this.blendSrcAlpha = source.blendSrcAlpha;
            this.blendDstAlpha = source.blendDstAlpha;
            this.blendEquationAlpha = source.blendEquationAlpha;

            this.depthFunc = source.depthFunc;
            this.depthTest = source.depthTest;
            this.depthWrite = source.depthWrite;

            this.colorWrite = source.colorWrite;

            this.precision = source.precision;

            this.polygonOffset = source.polygonOffset;
            this.polygonOffsetFactor = source.polygonOffsetFactor;
            this.polygonOffsetUnits = source.polygonOffsetUnits;

            this.alphaTest = source.alphaTest;

            this.premultipliedAlpha = source.premultipliedAlpha;

            this.overdraw = source.overdraw;

            this.visible = source.visible;
            this.clipShadows = source.clipShadows;

            var srcPlanes = source.clippingPlanes,
                dstPlanes = null;

            if (srcPlanes !== null)
            {
                var n = srcPlanes.length;
                dstPlanes = new Array(n);

                for (var i = 0; i !== n; ++i)
                    dstPlanes[i] = srcPlanes[i].clone();
            }

            this.clippingPlanes = dstPlanes;
            return this;
        }

        update()
        {
            this.dispatchEvent({ type: 'update' });
        }

        dispose()
        {
            this.dispatchEvent({ type: 'dispose' });
        }
    }

    export var MaterialIdCount = 0;
}
