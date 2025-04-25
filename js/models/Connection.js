/**
 * Connection between two network nodes
 */
class Connection {
    /**
     * Create a connection between two nodes
     * @param {Object} options - Configuration options
     * @param {NetworkNode} options.source - Source node
     * @param {NetworkNode} options.target - Target node
     * @param {String} options.type - Connection type (e.g., 'ethernet', 'fiber')
     * @param {Number} options.bandwidth - Connection bandwidth in Mbps
     */
    constructor(options = {}) {
        this.id = `conn-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        this.source = options.source;
        this.target = options.target;
        this.type = options.type || 'ethernet';
        this.bandwidth = options.bandwidth || 100; // Mbps
        this.line = null;
    }

    /**
     * Create the 3D representation of this connection
     * @param {THREE.Scene} scene - The Three.js scene to add this connection to
     */
    createMesh(scene) {
        // Remove any existing line
        if (this.line && this.line.parent) {
            scene.remove(this.line);
        }

        // Get connection color based on type
        const connectionColor = this.getColorForType();

        // Create a slightly curved path between nodes
        const start = new THREE.Vector3(
            this.source.position.x,
            this.source.position.y,
            this.source.position.z
        );

        const end = new THREE.Vector3(
            this.target.position.x,
            this.target.position.y,
            this.target.position.z
        );

        // Calculate midpoint with a slight elevation for the curve
        const midPoint = new THREE.Vector3(
            (start.x + end.x) / 2,
            (start.y + end.y) / 2 + 0.2, // Add a slight elevation
            (start.z + end.z) / 2
        );

        // Create a quadratic curve
        const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end);

        // Sample points along the curve
        const numPoints = 20;
        const points = [];
        for (let i = 0; i <= numPoints; i++) {
            const point = curve.getPoint(i / numPoints);
            points.push(point);
        }

        // Different visual styles based on connection type
        if (this.type === 'wireless') {
            // Dashed line for wireless connections
            const dashMaterial = new THREE.LineDashedMaterial({
                color: connectionColor,
                dashSize: 0.1,
                gapSize: 0.05,
                linewidth: 2
            });

            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            this.line = new THREE.Line(lineGeometry, dashMaterial);
            this.line.computeLineDistances(); // Required for dashed lines
        } else {
            // Solid line with glow effect for wired connections
            const material = new THREE.LineBasicMaterial({
                color: connectionColor,
                linewidth: this.type === 'fiber' ? 3 : 2,
                transparent: true,
                opacity: 0.8
            });

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            this.line = new THREE.Line(geometry, material);

            // Add a subtle glow effect for fiber connections
            if (this.type === 'fiber') {
                const glowMaterial = new THREE.LineBasicMaterial({
                    color: connectionColor,
                    linewidth: 5,
                    transparent: true,
                    opacity: 0.3
                });

                const glowLine = new THREE.Line(geometry, glowMaterial);
                scene.add(glowLine);
                this.glowLine = glowLine;
            }
        }

        this.line.userData.connection = this; // Reference back to this connection
        scene.add(this.line);

        // Add a label with bandwidth information
        this.createLabel(scene);
    }

    /**
     * Update the connection's visual representation
     */
    update() {
        if (!this.line) return;

        // For curved connections, we need to recreate the geometry
        // Get the scene from the line's parent
        const scene = this.line.parent;
        if (scene) {
            // Remove existing lines
            scene.remove(this.line);
            if (this.glowLine) {
                scene.remove(this.glowLine);
            }

            // Recreate the mesh with updated positions
            this.createMesh(scene);
        }
    }

    /**
     * Get color based on connection type
     * @returns {Number} Hex color code
     */
    getColorForType() {
        switch (this.type) {
            case 'fiber':
                return 0x4CAF50; // Modern green for fiber
            case 'wireless':
                return 0x2196F3; // Modern blue for wireless
            case 'ethernet':
            default:
                return 0xE0E0E0; // Light gray for ethernet
        }
    }

    /**
     * Create a text label for the connection
     * @param {THREE.Scene} scene - The Three.js scene
     */
    createLabel(scene) {
        // Use the LabelUtils to create a high-quality connection label
        this.label = LabelUtils.createConnectionLabel(`${this.bandwidth} Mbps`);

        // Position at midpoint
        const midpoint = {
            x: (this.source.position.x + this.target.position.x) / 2,
            y: (this.source.position.y + this.target.position.y) / 2 + 0.3,
            z: (this.source.position.z + this.target.position.z) / 2
        };

        this.label.position.set(midpoint.x, midpoint.y, midpoint.z);
        scene.add(this.label);
    }

    /**
     * Remove this connection from the scene
     * @param {THREE.Scene} scene - The Three.js scene
     */
    remove(scene) {
        if (this.line) {
            scene.remove(this.line);
        }

        // Remove glow line if it exists
        if (this.glowLine) {
            scene.remove(this.glowLine);
        }

        if (this.label) {
            scene.remove(this.label);
        }
    }

    /**
     * Convert connection to a serializable object
     * @returns {Object} Serialized representation
     */
    toJSON() {
        return {
            id: this.id,
            source: this.source.id,
            target: this.target.id,
            type: this.type,
            bandwidth: this.bandwidth
        };
    }
}
