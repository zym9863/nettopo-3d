/**
 * Network Switch device
 */
class Switch extends NetworkNode {
    /**
     * Create a switch node
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
        super({
            ...options,
            type: 'switch'
        });
    }

    /**
     * Create the 3D representation of this switch
     * @param {THREE.Scene} scene - The Three.js scene to add this node to
     */
    createMesh(scene) {
        // Create a group to hold all switch parts
        this.mesh = new THREE.Group();
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.mesh.userData.node = this; // Reference back to this node

        // Create main switch body with rounded edges
        const bodyGeometry = new THREE.BoxGeometry(1.3, 0.18, 0.65);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0x00bcd4, // Cyan color for switch
            specular: 0x222222,
            shininess: 60,
            flatShading: false
        });

        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        this.mesh.add(body);

        // Add top detail
        const topDetailGeometry = new THREE.BoxGeometry(1.32, 0.03, 0.67);
        const topDetailMaterial = new THREE.MeshPhongMaterial({
            color: 0x008ba3, // Darker cyan
            specular: 0x333333,
            shininess: 70
        });

        const topDetail = new THREE.Mesh(topDetailGeometry, topDetailMaterial);
        topDetail.position.y = 0.1;
        this.mesh.add(topDetail);

        // Add status LEDs
        const ledGeometry = new THREE.BoxGeometry(0.04, 0.02, 0.04);

        // Status LEDs on front
        const ledColors = [0x4CAF50, 0xFFC107, 0xF44336]; // Green, Yellow, Red

        ledColors.forEach((color, index) => {
            const ledMaterial = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.5,
                specular: 0xffffff
            });

            const led = new THREE.Mesh(ledGeometry, ledMaterial);
            led.position.set(-0.6 + (index * 0.08), 0.1, 0.3);
            this.mesh.add(led);
        });

        // Add port indicators with improved appearance
        const portGeometry = new THREE.BoxGeometry(0.08, 0.05, 0.1);
        const portMaterial = new THREE.MeshPhongMaterial({
            color: 0x212121,
            specular: 0x666666,
            shininess: 40
        });

        // Add multiple ports in a row with better spacing
        for (let i = -0.55; i <= 0.55; i += 0.11) {
            // Front ports
            const port = new THREE.Mesh(portGeometry, portMaterial);
            port.position.set(i, 0.05, 0.33);
            this.mesh.add(port);

            // Add port LED
            const portLedGeometry = new THREE.BoxGeometry(0.02, 0.02, 0.01);
            const portLedMaterial = new THREE.MeshPhongMaterial({
                color: 0x4CAF50,
                emissive: 0x4CAF50,
                emissiveIntensity: 0.3
            });

            const portLed = new THREE.Mesh(portLedGeometry, portLedMaterial);
            portLed.position.set(i - 0.03, 0.08, 0.39);
            this.mesh.add(portLed);

            // Back ports
            const port2 = new THREE.Mesh(portGeometry, portMaterial);
            port2.position.set(i, 0.05, -0.33);
            this.mesh.add(port2);
        }

        // Add rack mount brackets
        const bracketGeometry = new THREE.BoxGeometry(0.1, 0.05, 0.7);
        const bracketMaterial = new THREE.MeshPhongMaterial({
            color: 0x555555,
            specular: 0x999999,
            shininess: 30
        });

        // Left bracket
        const leftBracket = new THREE.Mesh(bracketGeometry, bracketMaterial);
        leftBracket.position.set(-0.7, 0, 0);
        this.mesh.add(leftBracket);

        // Right bracket
        const rightBracket = new THREE.Mesh(bracketGeometry, bracketMaterial);
        rightBracket.position.set(0.7, 0, 0);
        this.mesh.add(rightBracket);

        // Add label
        this.createLabel();

        scene.add(this.mesh);
    }

    /**
     * Create a text label for the switch
     */
    createLabel() {
        // Use the LabelUtils to create a high-quality label
        const sprite = LabelUtils.createNodeLabel(this.name, 0.5);
        this.mesh.add(sprite);
    }
}
