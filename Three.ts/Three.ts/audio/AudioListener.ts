/// <reference path="../core/object3d.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class AudioListener extends Object3D
    {
        context;
        gain;
        filter;
        constructor()
        {
            super();

            this.type = 'AudioListener';
            this.context = THREE.AudioContext;

            this.gain = this.context.createGain();
            this.gain.connect(this.context.destination);
            this.filter = null;
        };

        public getInput()
        {
            return this.gain;
        }
        public removeFilter()
        {
            if (this.filter !== null)
            {
                this.gain.disconnect(this.filter);
                this.filter.disconnect(this.context.destination);
                this.gain.connect(this.context.destination);
                this.filter = null;
            }
        }
        public getFilter()
        {
            return this.filter;
        }
        public setFilter(value)
        {
            if (this.filter !== null)
            {
                this.gain.disconnect(this.filter);
                this.filter.disconnect(this.context.destination);

            }
            else
            {
                this.gain.disconnect(this.context.destination);
            }

            this.filter = value;
            this.gain.connect(this.filter);
            this.filter.connect(this.context.destination);
        }
        public getMasterVolume()
        {
            return this.gain.gain.value;
        }
        public setMasterVolume(value)
        {
            this.gain.gain.value = value;
        }
        public updateMatrixWorld(force)
        {
            var position: Vector3 = AudioListener[".umw.position"];
            var quaternion: Quaternion = AudioListener[".umw.quaternion"];
            var scale: Vector3 = AudioListener[".umw.scale"];
            var orientation: Vector3 = AudioListener[".umw.orientation"];

            if (position === undefined)
            {
                position = AudioListener[".umw.position"] = new Vector3();
                quaternion = AudioListener[".umw.quaternion"] = new Quaternion();
                scale = AudioListener[".umw.scale"] = new Vector3();
                orientation = AudioListener[".umw.orientation"] = new Vector3();
            }

            super.updateMatrixWorld(force);

            var listener = this.context.listener;
            var up = this.up;

            this.matrixWorld.decompose(position, quaternion, scale);

            orientation.set(0, 0, - 1).applyQuaternion(quaternion);

            listener.setPosition(position.x, position.y, position.z);
            listener.setOrientation(orientation.x, orientation.y, orientation.z, up.x, up.y, up.z);
        }
    }
}