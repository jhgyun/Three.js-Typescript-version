/// <reference path="../core/eventdispatcher.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author szimek / https://github.com/szimek/
 */

namespace THREE
{
    export class Texture extends EventDispatcher
    {
        private _id = TextureIdCount++;
        get id()
        {
            return this._id;
        }
        uuid = Math.generateUUID();
        name = '';
        sourceFile = '';
        image: any;
        mipmaps = [];
        mapping: number;
        wrapS: number;
        wrapT: number;
        magFilter: number;
        minFilter: number;
        anisotropy: number;
        format: number;
        type: number;
        offset = new Vector2(0, 0);
        repeat = new Vector2(1, 1);
        generateMipmaps = true;
        premultiplyAlpha = false;
        flipY = true;
        /**
        * 1, 2, 4, 8
        */
        unpackAlignment = 4;//// valid values: 1, 2, 4, 8 (see http://www.khronos.org/opengles/sdk/docs/man/xhtml/glPixelStorei.xml)
        encoding: number;
        version = 0;
        onUpdate: any = null;

        constructor(image?,
            mapping?: number,
            wrapS?: number,
            wrapT?: number,
            magFilter?: number,
            minFilter?: number,
            format?: number,
            type?: number,
            anisotropy?: number,
            encoding?: number)
        {
            super();

            this.image = image !== undefined ? image : Texture.DEFAULT_IMAGE;
            this.mapping = mapping !== undefined ? mapping : Texture.DEFAULT_MAPPING;

            this.wrapS = wrapS !== undefined ? wrapS : ClampToEdgeWrapping;
            this.wrapT = wrapT !== undefined ? wrapT : ClampToEdgeWrapping;

            this.magFilter = magFilter !== undefined ? magFilter : LinearFilter;
            this.minFilter = minFilter !== undefined ? minFilter : LinearMipMapLinearFilter;

            this.anisotropy = anisotropy !== undefined ? anisotropy : 1;

            this.format = format !== undefined ? format : RGBAFormat;
            this.type = type !== undefined ? type : UnsignedByteType;
            // Values of encoding !== THREE.LinearEncoding only supported on map, envMap and emissiveMap.
            //
            // Also changing the encoding after already used by a Material will not automatically make the Material
            // update.  You need to explicitly call Material.needsUpdate to trigger it to recompile.
            this.encoding = encoding !== undefined ? encoding : LinearEncoding;

        };


        set needsUpdate(value: boolean)
        {
            if (value === true) this.version++;
        }

        clone(): this
        {
            return new (this.constructor as any)().copy(this);

        }
        copy(source: Texture)
        {

            this.image = source.image;
            this.mipmaps = source.mipmaps.slice(0);

            this.mapping = source.mapping;

            this.wrapS = source.wrapS;
            this.wrapT = source.wrapT;

            this.magFilter = source.magFilter;
            this.minFilter = source.minFilter;

            this.anisotropy = source.anisotropy;

            this.format = source.format;
            this.type = source.type;

            this.offset.copy(source.offset);
            this.repeat.copy(source.repeat);

            this.generateMipmaps = source.generateMipmaps;
            this.premultiplyAlpha = source.premultiplyAlpha;
            this.flipY = source.flipY;
            this.unpackAlignment = source.unpackAlignment;
            this.encoding = source.encoding;

            return this;

        }

        toJSON(meta)
        {
            if (meta.textures[this.uuid] !== undefined)
            {
                return meta.textures[this.uuid];
            }

            function getDataURL(image)
            {
                var canvas;
                if (image.toDataURL !== undefined)
                {
                    canvas = image;
                }
                else
                {
                    canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
                }

                if (canvas.width > 2048 || canvas.height > 2048)
                {
                    return canvas.toDataURL('image/jpeg', 0.6);
                }
                else
                {
                    return canvas.toDataURL('image/png');
                }
            }

            var output: any = {
                metadata: {
                    version: 4.4,
                    type: 'Texture',
                    generator: 'Texture.toJSON'
                },

                uuid: this.uuid,
                name: this.name,

                mapping: this.mapping,

                repeat: [this.repeat.x, this.repeat.y],
                offset: [this.offset.x, this.offset.y],
                wrap: [this.wrapS, this.wrapT],

                minFilter: this.minFilter,
                magFilter: this.magFilter,
                anisotropy: this.anisotropy
            };

            if (this.image !== undefined)
            {

                // TODO: Move to THREE.Image

                var image = this.image;

                if (image.uuid === undefined)
                {
                    image.uuid = Math.generateUUID(); // UGH 
                }

                if (meta.images[image.uuid] === undefined)
                {
                    meta.images[image.uuid] = {
                        uuid: image.uuid,
                        url: getDataURL(image)
                    };
                }
                output.image = image.uuid;
            }

            meta.textures[this.uuid] = output;
            return output;
        }

        dispose()
        {
            this.dispatchEvent({ type: 'dispose' });
        }

        transformUv(uv)
        {

            if (this.mapping !== UVMapping) return;

            uv.multiply(this.repeat);
            uv.add(this.offset);

            if (uv.x < 0 || uv.x > 1)
            {

                switch (this.wrapS)
                {

                    case RepeatWrapping:

                        uv.x = uv.x - Math.floor(uv.x);
                        break;

                    case ClampToEdgeWrapping:

                        uv.x = uv.x < 0 ? 0 : 1;
                        break;

                    case MirroredRepeatWrapping:

                        if (Math.abs(Math.floor(uv.x) % 2) === 1)
                        {

                            uv.x = Math.ceil(uv.x) - uv.x;

                        }
                        else
                        {
                            uv.x = uv.x - Math.floor(uv.x);
                        }
                        break;
                }

            }

            if (uv.y < 0 || uv.y > 1)
            {

                switch (this.wrapT)
                { 
                    case RepeatWrapping: 
                        uv.y = uv.y - Math.floor(uv.y);
                        break; 
                    case ClampToEdgeWrapping: 
                        uv.y = uv.y < 0 ? 0 : 1;
                        break; 
                    case MirroredRepeatWrapping: 
                        if (Math.abs(Math.floor(uv.y) % 2) === 1)
                        {
                            uv.y = Math.ceil(uv.y) - uv.y;
                        }
                        else
                        {
                            uv.y = uv.y - Math.floor(uv.y);
                        }
                        break;
                }
            }

            if (this.flipY)
            {
                uv.y = 1 - uv.y;
            }
        } 
        static DEFAULT_IMAGE = undefined;
        static DEFAULT_MAPPING = UVMapping; 
    } 
    export var TextureIdCount = 0;
}