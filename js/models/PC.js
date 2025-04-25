/**
 * PC/Computer network device
 */
class PC extends NetworkNode {
    /**
     * Create a PC node
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
        super({
            ...options,
            type: 'pc'
        });
    }

    /**
     * Create the 3D representation of this PC
     * @param {THREE.Scene} scene - The Three.js scene to add this node to
     */
    createMesh(scene) {
        // Create a group to hold all PC parts
        this.mesh = new THREE.Group();
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.mesh.userData.node = this; // Reference back to this node

        // Create modern monitor with better materials
        const monitorFrameGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.03);
        const monitorScreenGeometry = new THREE.BoxGeometry(0.75, 0.45, 0.01);
        const monitorStandBaseGeometry = new THREE.BoxGeometry(0.3, 0.02, 0.2);
        const monitorStandPillarGeometry = new THREE.BoxGeometry(0.05, 0.25, 0.05);

        // Modern dark gray for monitor frame
        const frameMaterial = new THREE.MeshPhongMaterial({
            color: 0x212121,
            specular: 0x999999,
            shininess: 60
        });

        // Screen with emissive property for a glowing effect
        const screenMaterial = new THREE.MeshPhongMaterial({
            color: 0x7e57c2, // Purple color for PC
            emissive: 0x7e57c2,
            emissiveIntensity: 0.2,
            specular: 0xffffff,
            shininess: 100
        });

        // Monitor frame
        const monitorFrame = new THREE.Mesh(monitorFrameGeometry, frameMaterial);
        monitorFrame.position.set(0, 0.3, 0);
        monitorFrame.castShadow = true;
        monitorFrame.receiveShadow = true;

        // Monitor screen
        const monitorScreen = new THREE.Mesh(monitorScreenGeometry, screenMaterial);
        monitorScreen.position.set(0, 0.3, 0.02);

        // Monitor stand base
        const standBase = new THREE.Mesh(monitorStandBaseGeometry, frameMaterial);
        standBase.position.set(0, 0.01, 0);
        standBase.castShadow = true;
        standBase.receiveShadow = true;

        // Monitor stand pillar
        const standPillar = new THREE.Mesh(monitorStandPillarGeometry, frameMaterial);
        standPillar.position.set(0, 0.14, 0);
        standPillar.castShadow = true;

        // Create computer tower
        const towerGeometry = new THREE.BoxGeometry(0.2, 0.4, 0.4);
        const towerMaterial = new THREE.MeshPhongMaterial({
            color: 0x424242,
            specular: 0x666666,
            shininess: 30
        });

        const tower = new THREE.Mesh(towerGeometry, towerMaterial);
        tower.position.set(-0.4, 0.2, 0);
        tower.castShadow = true;
        tower.receiveShadow = true;

        // Add power button to tower
        const buttonGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.01, 12);
        const buttonMaterial = new THREE.MeshPhongMaterial({
            color: 0x4CAF50,
            emissive: 0x4CAF50,
            emissiveIntensity: 0.5
        });

        const powerButton = new THREE.Mesh(buttonGeometry, buttonMaterial);
        powerButton.rotation.x = Math.PI / 2;
        powerButton.position.set(-0.4, 0.35, 0.21);

        // Add drive bays to tower
        const driveGeometry = new THREE.BoxGeometry(0.15, 0.02, 0.3);
        const driveMaterial = new THREE.MeshPhongMaterial({
            color: 0x212121,
            specular: 0x333333
        });

        // Add two drive bays
        for (let i = 0; i < 2; i++) {
            const drive = new THREE.Mesh(driveGeometry, driveMaterial);
            drive.position.set(-0.4, 0.3 - (i * 0.05), 0.2);
            this.mesh.add(drive);
        }

        // Add keyboard
        const keyboardGeometry = new THREE.BoxGeometry(0.4, 0.02, 0.15);
        const keyboardMaterial = new THREE.MeshPhongMaterial({
            color: 0x212121,
            specular: 0x666666
        });

        const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
        keyboard.position.set(0.1, 0.01, 0.2);
        keyboard.castShadow = true;
        keyboard.receiveShadow = true;

        // Add mouse
        const mouseGeometry = new THREE.BoxGeometry(0.05, 0.02, 0.1);
        const mouse = new THREE.Mesh(mouseGeometry, keyboardMaterial);
        mouse.position.set(0.3, 0.01, 0.2);
        mouse.castShadow = true;
        mouse.receiveShadow = true;

        // Add all parts to the group
        this.mesh.add(monitorFrame);
        this.mesh.add(monitorScreen);
        this.mesh.add(standBase);
        this.mesh.add(standPillar);
        this.mesh.add(tower);
        this.mesh.add(powerButton);
        this.mesh.add(keyboard);
        this.mesh.add(mouse);

        // Add label
        this.createLabel();

        scene.add(this.mesh);
    }

    /**
     * Create a text label for the PC
     */
    createLabel() {
        // Use the LabelUtils to create a high-quality label
        const sprite = LabelUtils.createNodeLabel(this.name, 0.7);
        this.mesh.add(sprite);
    }
}
