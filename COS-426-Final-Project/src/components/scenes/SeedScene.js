import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Flower, Land, Fox, BlockFigure } from 'objects';
import { BasicLights } from 'lights';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        var gui = new Dat.GUI()

        // Init state
        this.state = {
            gui: gui, // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        var settings = {
            //message: "dat.GUI",
            //checkbox: true,
            //colorA: '#FF00B4', 
            //colorB: '#22CBFF', 
            //step5: 10,
            // range: 50,
            options:"Flower"
            // speed:0,
            // func: function() 
            // { 
            //     console.log(this.range);
            // },
            // justgooddesign: function() 
            // { 
            //   window.location = "https://www.justgooddesign.com";
            // },
            // field1: "Field 1",
            // field2: "Field 2",
            // color0: "#ffae23", // CSS string
            // color1: [ 0, 128, 255 ], // RGB array
            // color2: [ 0, 128, 255, 0.3 ], // RGB with alpha
            // color3: { h: 350, s: 0.9, v: 0.3 } // Hue, saturation, value
          };

        //gui.add(settings, 'options', [ 'Figure', 'Fox', 'Flower'] );

        //var f1 = gui.addFolder('Meshes');
        //f1.add('Fox');
        const sceneOG = this

        // controls optional meshes for scene by clearing and re-rendering
        gui.add(settings, 'options', [ 'Figure', 'Fox', 'Flower'] ).onChange(function (value) {
            console.log(value);
            const { updateList } = sceneOG.state;
            // cleanUp loop, clear's scene on changes
            for (const obj of updateList) {
                obj.cleanUp()
                sceneOG.remove(obj);
                updateList.pop(obj);
            }
            if (value == 'Fox') {
                const fox = new Fox(sceneOG);
                sceneOG.add(fox);
            }
            if (value == 'Figure') {
                const figure = new BlockFigure(sceneOG);
                sceneOG.add(figure);
            }
            if (value == 'Flower') {
                const flower = new Flower(sceneOG);
                sceneOG.add(flower);
            }
        });

        // Add default meshes to scene
        const land = new Land();
        const flower = new Flower(this);
        const lights = new BasicLights();

        this.add(land, flower, lights);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            if (obj.name != 'blockFigure') {
                obj.update(timeStamp);
            }
        }
    }
}

export default SeedScene;
