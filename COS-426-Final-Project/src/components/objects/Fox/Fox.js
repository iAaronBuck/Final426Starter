import * as THREE from 'three';
import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
//import MODEL from './fox.gltf';

class Fox extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'fox';
        const source = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF/Fox.gltf";

        loader.load(source, (gltf) => {
            this.scale.set(.05,.05,.05);
            this.translateX(2);
            this.add(gltf.scene);
        });
    }
}

export default Fox;
