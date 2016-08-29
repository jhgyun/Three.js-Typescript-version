var THREE;
(function (THREE) {
    var WebGLLights = (function () {
        function WebGLLights() {
            this.lights = {};
        }
        ;
        WebGLLights.prototype.get = function (light) {
            var lights = this.lights;
            if (lights[light.id] !== undefined) {
                return lights[light.id];
            }
            var uniforms;
            switch (light.type) {
                case 'DirectionalLight':
                    uniforms = {
                        direction: new THREE.Vector3(),
                        color: new THREE.Color(),
                        shadow: false,
                        shadowBias: 0,
                        shadowRadius: 1,
                        shadowMapSize: new THREE.Vector2()
                    };
                    break;
                case 'SpotLight':
                    uniforms = {
                        position: new THREE.Vector3(),
                        direction: new THREE.Vector3(),
                        color: new THREE.Color(),
                        distance: 0,
                        coneCos: 0,
                        penumbraCos: 0,
                        decay: 0,
                        shadow: false,
                        shadowBias: 0,
                        shadowRadius: 1,
                        shadowMapSize: new THREE.Vector2()
                    };
                    break;
                case 'PointLight':
                    uniforms = {
                        position: new THREE.Vector3(),
                        color: new THREE.Color(),
                        distance: 0,
                        decay: 0,
                        shadow: false,
                        shadowBias: 0,
                        shadowRadius: 1,
                        shadowMapSize: new THREE.Vector2()
                    };
                    break;
                case 'HemisphereLight':
                    uniforms = {
                        direction: new THREE.Vector3(),
                        skyColor: new THREE.Color(),
                        groundColor: new THREE.Color()
                    };
                    break;
            }
            lights[light.id] = uniforms;
            return uniforms;
        };
        ;
        return WebGLLights;
    }());
    THREE.WebGLLights = WebGLLights;
})(THREE || (THREE = {}));
