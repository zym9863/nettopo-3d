/**
 * Base class for all network devices in the topology
 */
class NetworkNode {
    /**
     * Create a network node
     * @param {Object} options - Configuration options
     * @param {String} options.id - Unique identifier for the node
     * @param {String} options.name - Display name for the node
     * @param {Object} options.position - 3D position {x, y, z}
     * @param {String} options.type - Type of network node
     */
    constructor(options = {}) {
        this.id = options.id || `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        this.name = options.name || `Node ${this.id}`;
        this.position = options.position || { x: 0, y: 0, z: 0 };
        this.type = options.type || 'generic';
        this.connections = [];
        this.mesh = null;
        this.selected = false;
    }

    /**
     * Create the 3D representation of this node
     * @param {THREE.Scene} scene - The Three.js scene to add this node to
     */
    createMesh(scene) {
        // This will be implemented by subclasses
        console.warn('createMesh() should be implemented by subclasses');
    }

    /**
     * Update the node's position
     * @param {Object} position - New position {x, y, z}
     */
    setPosition(position) {
        this.position = position;
        if (this.mesh) {
            this.mesh.position.set(position.x, position.y, position.z);
        }
    }

    /**
     * Add a connection to another node
     * @param {Connection} connection - The connection object
     */
    addConnection(connection) {
        this.connections.push(connection);
    }

    /**
     * Remove a connection to another node
     * @param {String} connectionId - ID of the connection to remove
     */
    removeConnection(connectionId) {
        this.connections = this.connections.filter(conn => conn.id !== connectionId);
    }

    /**
     * Toggle selection state of this node
     */
    toggleSelection() {
        this.selected = !this.selected;
        this.updateSelectionVisual();
    }

    /**
     * Update visual appearance based on selection state
     */
    updateSelectionVisual() {
        if (!this.mesh) return;
        
        if (this.selected) {
            // Add selection highlight
            if (!this.selectionBox) {
                const boxGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
                const boxMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffff00,
                    wireframe: true
                });
                this.selectionBox = new THREE.Mesh(boxGeometry, boxMaterial);
                this.mesh.add(this.selectionBox);
            }
        } else {
            // Remove selection highlight
            if (this.selectionBox) {
                this.mesh.remove(this.selectionBox);
                this.selectionBox = null;
            }
        }
    }

    /**
     * Convert node to a serializable object
     * @returns {Object} Serialized representation
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            position: this.position
        };
    }
}
