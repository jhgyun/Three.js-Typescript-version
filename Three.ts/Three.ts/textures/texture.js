var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var Texture = (function (_super) {
        __extends(Texture, _super);
        function Texture(image, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding) {
            _super.call(this);
            this._id = THREE.TextureIdCount++;
            this.uuid = THREE.Math.generateUUID();
            this.name = '';
            this.sourceFile = '';
            this.mipmaps = [];
            this.offset = new THREE.Vector2(0, 0);
            this.repeat = new THREE.Vector2(1, 1);
            this.generateMipmaps = true;
            this.premultiplyAlpha = false;
            this.flipY = true;
            this.unpackAlignment = 4;
            this.version = 0;
            this.onUpdate = null;
            this.image = image !== undefined ? image : Texture.DEFAULT_IMAGE;
            this.mapping = mapping !== undefined ? mapping : Texture.DEFAULT_MAPPING;
            this.wrapS = wrapS !== undefined ? wrapS : THREE.ClampToEdgeWrapping;
            this.wrapT = wrapT !== undefined ? wrapT : THREE.ClampToEdgeWrapping;
            this.magFilter = magFilter !== undefined ? magFilter : THREE.LinearFilter;
            this.minFilter = minFilter !== undefined ? minFilter : THREE.LinearMipMapLinearFilter;
            this.anisotropy = anisotropy !== undefined ? anisotropy : 1;
            this.format = format !== undefined ? format : THREE.RGBAFormat;
            this.type = type !== undefined ? type : THREE.UnsignedByteType;
            this.encoding = encoding !== undefined ? encoding : THREE.LinearEncoding;
        }
        Object.defineProperty(Texture.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Texture.prototype, "needsUpdate", {
            set: function (value) {
                if (value === true)
                    this.version++;
            },
            enumerable: true,
            configurable: true
        });
        Texture.prototype.clone = function () {
            return new this.constructor().copy(this);
        };
        Texture.prototype.copy = function (source) {
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
        };
        Texture.prototype.toJSON = function (meta) {
            if (meta.textures[this.uuid] !== undefined) {
                return meta.textures[this.uuid];
            }
            function getDataURL(image) {
                var canvas;
                if (image.toDataURL !== undefined) {
                    canvas = image;
                }
                else {
                    canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
                }
                if (canvas.width > 2048 || canvas.height > 2048) {
                    return canvas.toDataURL('image/jpeg', 0.6);
                }
                else {
                    return canvas.toDataURL('image/png');
                }
            }
            var output = {
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
                anisotropy: this.anisotropy,
                flipY: this.flipY
            };
            if (this.image !== undefined) {
                var image = this.image;
                if (image.uuid === undefined) {
                    image.uuid = THREE.Math.generateUUID();
                }
                if (meta.images[image.uuid] === undefined) {
                    meta.images[image.uuid] = {
                        uuid: image.uuid,
                        url: getDataURL(image)
                    };
                }
                output.image = image.uuid;
            }
            meta.textures[this.uuid] = output;
            return output;
        };
        Texture.prototype.dispose = function () {
            this.dispatchEvent({ type: 'dispose' });
        };
        Texture.prototype.transformUv = function (uv) {
            if (this.mapping !== THREE.UVMapping)
                return;
            uv.multiply(this.repeat);
            uv.add(this.offset);
            if (uv.x < 0 || uv.x > 1) {
                switch (this.wrapS) {
                    case THREE.RepeatWrapping:
                        uv.x = uv.x - THREE.Math.floor(uv.x);
                        break;
                    case THREE.ClampToEdgeWrapping:
                        uv.x = uv.x < 0 ? 0 : 1;
                        break;
                    case THREE.MirroredRepeatWrapping:
                        if (THREE.Math.abs(THREE.Math.floor(uv.x) % 2) === 1) {
                            uv.x = THREE.Math.ceil(uv.x) - uv.x;
                        }
                        else {
                            uv.x = uv.x - THREE.Math.floor(uv.x);
                        }
                        break;
                }
            }
            if (uv.y < 0 || uv.y > 1) {
                switch (this.wrapT) {
                    case THREE.RepeatWrapping:
                        uv.y = uv.y - THREE.Math.floor(uv.y);
                        break;
                    case THREE.ClampToEdgeWrapping:
                        uv.y = uv.y < 0 ? 0 : 1;
                        break;
                    case THREE.MirroredRepeatWrapping:
                        if (THREE.Math.abs(THREE.Math.floor(uv.y) % 2) === 1) {
                            uv.y = THREE.Math.ceil(uv.y) - uv.y;
                        }
                        else {
                            uv.y = uv.y - THREE.Math.floor(uv.y);
                        }
                        break;
                }
            }
            if (this.flipY) {
                uv.y = 1 - uv.y;
            }
        };
        Texture.DEFAULT_IMAGE = undefined;
        Texture.DEFAULT_MAPPING = THREE.UVMapping;
        return Texture;
    }(THREE.EventDispatcher));
    THREE.Texture = Texture;
    THREE.TextureIdCount = 0;
})(THREE || (THREE = {}));
