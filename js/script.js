let mobile = false;
if ( navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
    mobile = true;
} else {
    mobile = false;
}

class Star {
    constructor(radius, material, posX, posY, posZ) {
        const points = 5;
        let angle = 0;
        this.star = new THREE.Object3D();
        for (let i = 0; i < points; i++) {
            const starShard = new THREE.Mesh(
                new THREE.OctahedronGeometry(radius, 0), material
            );
            starShard.rotateZ(angle);
            let y = 0.5 * Math.cos(angle);
            let x = -0.5 * Math.sin(angle);
            starShard.position.set(x, y, 0);
            this.star.add(starShard);
            angle += Math.PI * 2 / points;
        }
        this.star.position.set(posX, posY, posZ);
        this.star.scale.z = 0.3;
    }
    update(speed) {
        this.star.rotation.y += speed;
    }
    gimme() {
        return this.star;
    }
}

class Scene {
    constructor() {
        this.star_arr = [];
        this.createScene();
        this.pointerLock();
        this.addLights();
    }
    pointerLock() {
        const havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
        this.controlsEnabled = false;
        if ( havePointerLock ) {
            let element = document.body;
            let pointerlockchange = ( event ) => {
                if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
                    this.controlsEnabled = true;
                    this.controls.enabled = true;
                } else {
                    this.controls.enabled = false;
                }
            };
            document.addEventListener( 'pointerlockchange', pointerlockchange, false );
            document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
            document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
            element.addEventListener( 'click', ( event ) => {
                element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
                element.requestPointerLock();
            }, false );
        }
    }
    createScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.2, 200);
        this.camera.position.set(0, 0, 0);
        this.renderer = new THREE.WebGLRenderer;
        this.renderer.setClearColor(0x120021);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        if(mobile) {
            this.controls2 = new THREE.DeviceOrientationControls(this.camera);
        } else {
            this.controls = new THREE.PointerLockControls(this.camera);
            this.scene.add(this.controls.getObject());
        }
        this.effect = new THREE.StereoEffect(this.renderer);
        this.container = document.getElementById('container');
        this.container.appendChild(this.renderer.domElement);
        this.render();
    }
    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.effect.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    addLights() {
        this.ambientLight = new THREE.AmbientLight(0xaaaaaa);
        this.scene.add(this.ambientLight);
        this.light = new THREE.DirectionalLight(0xffffff, 1);
        this.light.position.set(0, 50, 50);
        this.scene.add(this.light);
    }
    render() {
        requestAnimationFrame(() => {
            if(mobile) this.controls2.update();
            this.render();
        });
        this.star_arr.forEach((star) => {
            let speed = Math.random() / 10 - 0.01;
            star.update(speed);
        });
        window.addEventListener('resize', this.resize(), false);
        if(mobile && (window.innerWidth > window.innerHeight)) {
            this.effect.render(this.scene, this.camera);
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    }
    add(mesh) {
        if(mesh.star) {
            this.star_arr.push(mesh);
        }
        this.scene.add(mesh.gimme());
    }
}

let scene = new Scene();
const stars = 100;
for (let i = 0; i < stars; i++) {
    let randomX = Math.random() * 201;
    let randomY = Math.random() * 101;
    let randomZ = Math.random() * 201;
    let x = randomX - 100;
    let y = randomY - 50;
    let z = randomZ - 100;
    scene.add(new Star(3, new THREE.MeshPhongMaterial({color: 0xF0A024}), x, y, z));
}
