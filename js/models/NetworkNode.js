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
     * @param {String} options.ipAddress - IP address of the node
     * @param {String} options.status - Status of the node ('online', 'offline', 'warning')
     */
    constructor(options = {}) {
        this.id = options.id || `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        this.name = options.name || `Node ${this.id}`;
        this.position = options.position || { x: 0, y: 0, z: 0 };
        this.type = options.type || 'generic';
        this.ipAddress = options.ipAddress || this.generateRandomIP();
        this.status = options.status || 'online';
        this.connections = [];
        this.mesh = null;
        this.selected = false;
    }

    /**
     * Generate a random IP address
     * @returns {String} Random IP address
     */
    generateRandomIP() {
        const octet1 = Math.floor(Math.random() * 223) + 1; // Avoid reserved ranges
        const octet2 = Math.floor(Math.random() * 256);
        const octet3 = Math.floor(Math.random() * 256);
        const octet4 = Math.floor(Math.random() * 254) + 1; // Avoid .0 and .255

        // Use private IP ranges for realistic network topologies
        if (octet1 === 10 || (octet1 === 172 && octet2 >= 16 && octet2 <= 31) || (octet1 === 192 && octet2 === 168)) {
            return `${octet1}.${octet2}.${octet3}.${octet4}`;
        } else {
            // Default to 192.168.x.y for private networks
            return `192.168.${octet3 % 256}.${octet4}`;
        }
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
            position: this.position,
            ipAddress: this.ipAddress,
            status: this.status
        };
    }

    /**
     * Get formatted information about this node's connections
     * @returns {String} Formatted connection information
     */
    getConnectionsInfo() {
        if (this.connections.length === 0) {
            return "None";
        }

        return this.connections.map(conn => {
            const otherNode = conn.source.id === this.id ? conn.target : conn.source;
            return `${otherNode.name} (${conn.type}, ${conn.bandwidth} Mbps)`;
        }).join('<br>');
    }
}
