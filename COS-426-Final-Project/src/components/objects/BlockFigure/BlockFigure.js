import { Group, MeshLambertMaterial, BoxGeometry, Mesh, SphereGeometry } from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import gsap from "gsap";
import * as Dat from 'dat.gui';
import { IcosahedronGeometry, CylinderGeometry} from 'three';

const degreesToRadians = (degrees) => {
	return degrees * (Math.PI / 180)
}

const random = (min, max, float = false) => {
  const val = Math.random() * (max - min) + min;

  if (float) {
    return val;
  }

  return Math.floor(val);
}

// Material
//const material = new THREE.MeshLambertMaterial({ color: 0xffffff })

// Figure
class BlockFigure extends Group {
	constructor(parent, params) {
        super();
        // positioning coords and rotation
		this.params = {
			x: -2.5,
			y: 3,
			z: -0.5,
			ry: 0,
			...params
		};

        this.name = 'blockFigure'

        // Init state
        this.state = {
            gui: new Dat.GUI(),
            parent: parent,
            running: false,
            headMesh: null,
            settings: {
                animationType: 'Bouncing',
                armType: 'blocky',
                legType: 'blocky',
                headType: 'spherical',
                headHue: random(0, 360),
                bodyHue: random(0, 360),
                headLightness: random(40, 65),
            },
            exportMeshNow: false
        };

        var gui = this.state.gui;

        var settings = this.state.settings;
        var options = this.state;

        // need to add the fields for each of the properties
        this.group = new Group();
		parent.add(this.group);

        // upon re-render for change
        // this.parent.remove(this.group);
        // parent.remove(this.group);
        // parent.pop(this);

        // // after changes complete
        // parent.add(this);
        // parent.addToUpdateList(this);
        
        const groupOG = this.group;
        
        var OG = this;

        gui.add(options, "exportMeshNow").onChange((val) => {
            options.exportMeshNow = val;
            if (options.exportMeshNow == true) {
                OG.export()
            }
        });

        gui.add(settings, 'headType', [ 'blocky', 'cylindrical', 'spherical', 'icosahedron'] ).onChange(function (value) {
            console.log(settings);
            // const { updateList } = sceneOG.state;
            // cleanUp loop, clear's scene on changes
            // upon re-render for change
            console.log(OG)
            OG.state.parent.remove(OG.group);
            console.log(OG.state.parent)
            OG.state.settings.headType = value;

            OG.init()

            // after changes complete
            OG.state.parent.add(OG.group);
            //OG.state.parent.addToUpdateList(OG);
            // OG.parent.add(OG)

        });

        // var blockSettings = {
        //     animationType: 'Bouncing',
        //     armType: 'blocky',
        //     legType: 'blocky',
        //     headType: 'blocky',
        //     headHue: random(0, 360),
        //     bodyHue: random(0, 360),
        //     headLightness: random(40, 65),
        // }
        
		// Create group and add to scene
		this.group = new Group();
		parent.add(this.group);

		// Position according to params
		this.group.position.x = this.params.x;
		this.group.position.y = this.params.y;
		this.group.position.z = this.params.z;
		this.group.rotation.ry = this.params.ry
		// could make it bigger/smaller here
        // this.group.scale.set(5, 5, 5)

        // Material
		// this.headHue = random(0, 360);
		// this.bodyHue = random(0, 360);
		// this.headLightness = random(40, 65);
		this.headMaterial = new MeshLambertMaterial({ color: `hsl(${settings.headHue}, 30%, ${settings.headLightness}%)` });
		this.bodyMaterial = new MeshLambertMaterial({ color: `hsl(${settings.bodyHue}, 85%, 50%)` });
		this.arms = [];
        this.legs = [];
        parent.addToUpdateList(this);
        this.init();
	}

    export() {
        const exporter = new GLTFExporter();

        function downloadJSON( json, filename ) {
            saveString( JSON.stringify( json ), filename );
        }

        var link = document.createElement( 'a' );
        link.style.display = 'none';
        document.body.appendChild( link ); // Firefox workaround, see #6594

        function save( blob, filename ) {
            link.href = URL.createObjectURL( blob );
            link.download = filename;
            link.click();
        }

        function saveString( text, filename ) {
            save( new Blob( [ text ], { type: 'text/plain' } ), filename );
        }

        // Parse the input and generate the glTF output
        exporter.parse(
            this,
            // called when the gltf has been generated
            function ( gltf ) {
                //console.log( gltf );
                downloadJSON( gltf, 'blockFigure.gltf' );
            },
            // called when there is an error in the generation
            function ( error ) {
                console.log( 'An error happened' );
            }
        );
    }

	createBody() {
		this.body = new Group();
		const geometry = new BoxGeometry(1, 1.5, 1);
		const bodyMain = new Mesh(geometry, this.bodyMaterial);
		this.body.add(bodyMain);
		this.group.add(this.body);
		this.createLegs();
	}

	createHead() {
		// Create a new group for the head
        console.log(this.head);
        if (this.state.headMesh != null) {
            this.group.remove(this.head);
            this.head.remove(this.state.headMesh);
            
        }
		this.head = new Group();
        var geometry = null;
		// Create the main cube of the head and add to the group
		// const geometry = new BoxGeometry(1.4, 1.4, 1.4);
        if (this.state.settings.headType == "spherical") {
            geometry = new SphereGeometry(0.85);
        } else  if (this.state.settings.headType == "blocky") {
            geometry = new BoxGeometry(1.4, 1.4, 1.4);
        } else  if (this.state.settings.headType == "cylindrical") {
            geometry = new CylinderGeometry(0.8, 0.8, 1.4);
        } else if (this.state.settings.headType == "icosahedron"){
            geometry = new IcosahedronGeometry(0.85);
        }

		this.state.headMesh = new Mesh(geometry, this.headMaterial);
		this.head.add(this.state.headMesh);
		// Add the head group to the figure
		this.group.add(this.head);
		// Position the head group
		this.head.position.y = 1.65;
		// Add the eyes
		this.createEyes();
	}

	createArms() {
		const height = 0.85;
		for(let i = 0; i < 2; i++) {
			const armGroup = new Group();
			const geometry = new BoxGeometry(0.25, height, 0.25);
			const arm = new Mesh(geometry, this.headMaterial);
			const m = i % 2 === 0 ? 1 : -1;
			// Add arm to group
			armGroup.add(arm);
			// Add group to figure
			this.body.add(armGroup);
			// Translate the arm by half the height
			arm.position.y = height * -0.5;
			// Position the arm relative to the figure
			armGroup.position.x = m * 0.8;
			armGroup.position.y = 0.6;
			// Rotate the arm
			armGroup.rotation.z = degreesToRadians(30 * m);
			// Push to the array
			this.arms.push(armGroup);
		}
	}

	createEyes() {
		const eyes = new Group();
		const geometry = new SphereGeometry(0.15, 12, 8);
		const material = new MeshLambertMaterial({ color: 0x44445c });
		for(let i = 0; i < 2; i++) {
			const eye = new Mesh(geometry, material);
			const m = i % 2 === 0 ? 1 : -1;
			eyes.add(eye);
			eye.position.x = 0.36 * m;
		}
		this.head.add(eyes);
        if (this.state.settings.headType == 'icosahedron') {
            eyes.position.z = 0.55;
        } else {
            eyes.position.z = 0.7;
        }
		// eyes.position.y = -0.1;
        eyes.position.y = 0.1;
		
	}

	createLegs() {
		const legs = new Group();
		const geometry = new BoxGeometry(0.25, 0.4, 0.25);
		for(let i = 0; i < 2; i++) {
			const leg = new Mesh(geometry, this.headMaterial);
			const m = i % 2 === 0 ? 1 : -1;
			legs.add(leg);
			leg.position.x = m * 0.22;
            this.legs.push(leg);
		}
		this.group.add(legs);
		legs.position.y = -1.15;
		this.body.add(legs);
	}

	bounce() {
		this.group.rotation.y = this.params.ry;
		this.group.position.y = this.params.y;
		this.arms.forEach((arm, index) => {
			const m = index % 2 === 0 ? 1 : -1
			arm.rotation.z = this.params.armRotation * m;
		});
    };

    walk() {
		this.group.rotation.y = this.params.ry;
		this.group.position.y = this.params.y;
		this.legs.forEach((leg, index) => {
			const m = index % 2 === 0 ? 1 : -1
			leg.rotation.z = this.params.legRotation * m;
		});
    };

    animate() {
        if (!this.state.running) {
            this.state.running = true;
        } else {
            return;
        }
        // gsap.set(this.params, {
        //     y: 2.5
        // });
        // gsap.to(this.params, {
        //     ry: degreesToRadians(360),
        //     repeat: -1,
        //     duration: 20
        // });
        // gsap.to(this.params, {
        //     y: 0,
        //     armRotation: degreesToRadians(90),
        //     repeat: -1,
        //     yoyo: true,
        //     duration: 0.5
        // });
        gsap.to(this.params, {
            //y: 0,
            legRotation: degreesToRadians(90),
            repeat: -1,
            yoyo: true,
            duration: 0.5
        });

        // provided timestep advancing
        gsap.ticker.add(() => {
            //this.bounce()
            this.walk()
        });
    }

	init() {
		this.createBody();
        // if (this.blockSettings.headType == "blocky") {
        //     this.createBlockHead();
        // } else if (this.blockSettings.headType == "cylindrical") {
        //     this.createCylindricalHead();
        // } else if (this.blockSettings.headType == "spherical") {
        //     this.createCylindricalHead();
        // } else if (this.blockSettings.headType == "icosahedron") {
        //     this.createIcosahedronHead();
        // }
        this.createHead();
		
		this.createArms();
        this.animate();
        // for exporting gltf file of mesh, can be enabled
        // will likely integrate with gui for user-selected
        // mesh saving
        //this.export();
	}

    cleanUp() {
        this.parent.remove(this.group);
        this.state.gui.destroy();
    }


}

export default BlockFigure;