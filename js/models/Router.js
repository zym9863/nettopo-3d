/**
 * Router network device
 */
class Router extends NetworkNode {
    /**
     * Create a router node
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
        super({
            ...options,
            type: 'router'
        });
    }

    /**
     * Create the 3D representation of this router
     * @param {THREE.Scene} scene - The Three.js scene to add this node to
     */
    createMesh(scene) {
        // Create a group to hold all router parts
        this.mesh = new THREE.Group();
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.mesh.userData.node = this; // Reference back to this node

        // Create a more detailed router body
        const bodyGeometry = new THREE.BoxGeometry(1, 0.25, 0.8);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0x3f51b5, // Primary router color
            specular: 0x222222,
            shininess: 50,
            flatShading: false
        });

        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        this.mesh.add(body);

        // Add beveled edges using additional geometry
        const edgeGeometry = new THREE.BoxGeometry(1.02, 0.05, 0.82);
        const edgeMaterial = new THREE.MeshPhongMaterial({
            color: 0x303f9f, // Slightly darker than body
            specular: 0x222222,
            shininess: 60
        });

        const topEdge = new THREE.Mesh(edgeGeometry, edgeMaterial);
        topEdge.position.y = 0.15;
        topEdge.castShadow = true;
        this.mesh.add(topEdge);

        // Add LED indicators
        const ledGeometry = new THREE.BoxGeometry(0.05, 0.02, 0.05);
        const ledPositions = [
            { x: 0.4, y: 0.14, z: 0.35, color: 0x4CAF50 }, // Green
            { x: 0.3, y: 0.14, z: 0.35, color: 0xFFC107 }, // Yellow
            { x: 0.2, y: 0.14, z: 0.35, color: 0x2196F3 }, // Blue
            { x: 0.1, y: 0.14, z: 0.35, color: 0xF44336 }  // Red
        ];

        ledPositions.forEach(pos => {
            const ledMaterial = new THREE.MeshPhongMaterial({
                color: pos.color,
                emissive: pos.color,
                emissiveIntensity: 0.5,
                specular: 0xffffff
            });

            const led = new THREE.Mesh(ledGeometry, ledMaterial);
            led.position.set(pos.x, pos.y, pos.z);
            this.mesh.add(led);
        });

        // Add antennas with improved appearance
        const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.6);
        const antennaMaterial = new THREE.MeshPhongMaterial({
            color: 0x212121,
            specular: 0x999999,
            shininess: 80
        });

        // Add three antennas
        for (let i = -1; i <= 1; i += 1) {
            const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
            antenna.position.set(i * 0.25, 0.5, 0);
            antenna.rotation.x = Math.PI / 2;

            // Add antenna tip
            const tipGeometry = new THREE.ConeGeometry(0.02, 0.05, 8);
            const tipMaterial = new THREE.MeshPhongMaterial({
                color: 0x000000,
                specular: 0x999999,
                shininess: 80
            });

            const tip = new THREE.Mesh(tipGeometry, tipMaterial);
            tip.position.y = 0.325;
            antenna.add(tip);

            this.mesh.add(antenna);
        }

        // Add network ports
        const portGeometry = new THREE.BoxGeometry(0.12, 0.1, 0.05);
        const portMaterial = new THREE.MeshPhongMaterial({
            color: 0x424242,
            specular: 0x666666
        });

        // Add multiple ports in a row
        for (let i = -0.35; i <= 0.35; i += 0.15) {
            const port = new THREE.Mesh(portGeometry, portMaterial);
            port.position.set(i, -0.05, 0.4);
            this.mesh.add(port);
        }

        // Add label
        this.createLabel();

        scene.add(this.mesh);
    }

    /**
     * Create a text label for the router
     */
    createLabel() {
        // Use the LabelUtils to create a high-quality label
        const sprite = LabelUtils.createNodeLabel(this.name, 0.5);
        this.mesh.add(sprite);
    }
}
