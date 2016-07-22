/// <reference path="eventdispatcher.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class DirectGeometry extends EventDispatcher
    {
        private _id = GeometryIdCount++;
        get id()
        {
            return this._id;
        }

        uuid = Math.generateUUID();

        name = '';
        type = 'DirectGeometry';

        indices = [];
        vertices: Vector3[] = [];
        normals: Vector3[] = [];
        colors: Color[] = [];
        uvs: Vector2[] = [];
        uvs2 = [];

        groups = [];

        morphTargets: any = {};

        skinWeights = [];
        skinIndices = [];

        // this.lineDistances = [];
        boundingBox: Box3 = null;
        boundingSphere: Sphere = null;

        // update flags 
        verticesNeedUpdate = false;
        normalsNeedUpdate = false;
        colorsNeedUpdate = false;
        uvsNeedUpdate = false;
        groupsNeedUpdate = false;
        constructor()
        {
            super();
        }

        computeBoundingBox()
        {
            if (this.boundingBox === null)
            {
                this.boundingBox = new Box3();
            }
            this.boundingBox.setFromPoints(this.vertices);
        }
        computeBoundingSphere()
        {
            if (this.boundingSphere === null)
            {
                this.boundingSphere = new Sphere();
            }
            this.boundingSphere.setFromPoints(this.vertices);
        }

        computeGroups(geometry: Geometry)
        {
            var group;
            var groups = [];
            var materialIndex: number;
            var faces = geometry.faces;

            for (var i = 0; i < faces.length; i++)
            {
                var face = faces[i];
                // materials

                if (face.materialIndex !== materialIndex)
                {
                    materialIndex = face.materialIndex;
                    if (group !== undefined)
                    {
                        group.count = (i * 3) - group.start;
                        groups.push(group);
                    }

                    group = {
                        start: i * 3,
                        materialIndex: materialIndex
                    };
                }
            }

            if (group !== undefined)
            {
                group.count = (i * 3) - group.start;
                groups.push(group);
            }

            this.groups = groups;
        }

        fromGeometry(geometry: Geometry)
        {
            var faces = geometry.faces;
            var vertices = geometry.vertices;
            var faceVertexUvs = geometry.faceVertexUvs;

            var hasFaceVertexUv = faceVertexUvs[0] && faceVertexUvs[0].length > 0;
            var hasFaceVertexUv2 = faceVertexUvs[1] && faceVertexUvs[1].length > 0;

            // morphs 
            var morphTargets = geometry.morphTargets;
            var morphTargetsLength = morphTargets.length;

            var morphTargetsPosition;

            if (morphTargetsLength > 0)
            {
                morphTargetsPosition = [];
                for (var i = 0; i < morphTargetsLength; i++)
                {
                    morphTargetsPosition[i] = [];
                }

                this.morphTargets.position = morphTargetsPosition;
            }

            var morphNormals = geometry.morphNormals;
            var morphNormalsLength = morphNormals.length;

            var morphTargetsNormal;

            if (morphNormalsLength > 0)
            {
                morphTargetsNormal = [];
                for (var i = 0; i < morphNormalsLength; i++)
                {
                    morphTargetsNormal[i] = [];
                }

                this.morphTargets.normal = morphTargetsNormal;
            }

            // skins 
            var skinIndices = geometry.skinIndices;
            var skinWeights = geometry.skinWeights;

            var hasSkinIndices = skinIndices.length === vertices.length;
            var hasSkinWeights = skinWeights.length === vertices.length;
            //

            for (var i = 0; i < faces.length; i++)
            {
                var face = faces[i];
                this.vertices.push(vertices[face.a], vertices[face.b], vertices[face.c]);

                var vertexNormals = face.vertexNormals;
                if (vertexNormals.length === 3)
                {
                    this.normals.push(vertexNormals[0], vertexNormals[1], vertexNormals[2]);
                }
                else
                {
                    var normal = face.normal;
                    this.normals.push(normal, normal, normal);
                }

                var vertexColors = face.vertexColors;

                if (vertexColors.length === 3)
                {
                    this.colors.push(vertexColors[0], vertexColors[1], vertexColors[2]);
                }
                else
                {
                    var color = face.color;
                    this.colors.push(color, color, color);
                }

                if (hasFaceVertexUv === true)
                {
                    var vertexUvs = faceVertexUvs[0][i];

                    if (vertexUvs !== undefined)
                    {
                        this.uvs.push(vertexUvs[0], vertexUvs[1], vertexUvs[2]);
                    }
                    else
                    {
                        console.warn('THREE.DirectGeometry.fromGeometry(): Undefined vertexUv ', i);
                        this.uvs.push(new Vector2(), new Vector2(), new Vector2());
                    }
                }

                if (hasFaceVertexUv2 === true)
                {
                    var vertexUvs = faceVertexUvs[1][i];
                    if (vertexUvs !== undefined)
                    {
                        this.uvs2.push(vertexUvs[0], vertexUvs[1], vertexUvs[2]);
                    }
                    else
                    {
                        console.warn('THREE.DirectGeometry.fromGeometry(): Undefined vertexUv2 ', i);
                        this.uvs2.push(new Vector2(), new Vector2(), new Vector2());
                    }
                }

                // morphs

                for (var j = 0; j < morphTargetsLength; j++)
                {
                    var morphTarget = morphTargets[j].vertices;
                    morphTargetsPosition[j].push(morphTarget[face.a], morphTarget[face.b], morphTarget[face.c]);
                }

                for (var j = 0; j < morphNormalsLength; j++)
                {
                    var morphNormal = morphNormals[j].vertexNormals[i];
                    morphTargetsNormal[j].push(morphNormal.a, morphNormal.b, morphNormal.c);
                }

                // skins 
                if (hasSkinIndices)
                {
                    this.skinIndices.push(skinIndices[face.a], skinIndices[face.b], skinIndices[face.c]);
                }

                if (hasSkinWeights)
                {
                    this.skinWeights.push(skinWeights[face.a], skinWeights[face.b], skinWeights[face.c]);
                }
            }

            this.computeGroups(geometry);

            this.verticesNeedUpdate = geometry.verticesNeedUpdate;
            this.normalsNeedUpdate = geometry.normalsNeedUpdate;
            this.colorsNeedUpdate = geometry.colorsNeedUpdate;
            this.uvsNeedUpdate = geometry.uvsNeedUpdate;
            this.groupsNeedUpdate = geometry.groupsNeedUpdate;

            return this;
        }

        dispose()
        {
            this.dispatchEvent({ type: 'dispose' });
        }
    }
}