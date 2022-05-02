import * as THREE from 'three';
import { Group, Int8Attribute } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
//import MODEL from './fox.gltf';

class Fox extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            model: null,
            animation: null,
            action: null,
            mixer: null,
            clips: null,
            // Can select Survey Run or Walk
            action: "Walk",
            survey: true

        };

        this.name = 'fox';
    
        var fox = this;
        const loader = new GLTFLoader();
        const source = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF/Fox.gltf";
        loader.load(source, (gltf) => {
            console.log(gltf);
            
            //Create animation mixer and clips to run later
            fox.state.model = gltf;
            fox.state.mixer = new THREE.AnimationMixer( gltf.scene );
            fox.state.clips = fox.state.model.animations;
            
            this.add(gltf.scene);
            this.scale.set(.05,.05,.05);
            this.translateX(2);
            console.log("loaded");
    });
    // Add self to parent's update list
    parent.addToUpdateList(this);
    
    // Populate GUI
    this.customGuiStuff = this.state.gui.add(this.state, 'survey');
    }
    
    update(timeStamp){
        if (this.state.model != null){
            if (this.state.action == "Run"){
                this.state.mixer.update(.03);
            }else{this.state.mixer.update(.01)}
            const clip = THREE.AnimationClip.findByName( this.state.model, this.state.action );
            const action = this.state.mixer.clipAction( clip );
            action.play();
        }
    }

    cleanUp() {
        this.state.gui.remove(this.customGuiStuff)
    }



}

export default Fox;
