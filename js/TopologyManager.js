/**
 * Manages the network topology
 */
class TopologyManager {
    /**
     * Create a topology manager
     * @param {SceneManager} sceneManager - Reference to the scene manager
     */
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.nodes = new Map(); // Map of node ID to node object
        this.connections = new Map(); // Map of connection ID to connection object
        this.selectedNodes = []; // Currently selected nodes (for creating connections)
    }

    /**
     * Add a node to the topology
     * @param {NetworkNode} node - The node to add
     */
    addNode(node) {
        this.nodes.set(node.id, node);
        node.createMesh(this.sceneManager.scene);
    }

    /**
     * Remove a node from the topology
     * @param {String} nodeId - ID of the node to remove
     */
    removeNode(nodeId) {
        const node = this.nodes.get(nodeId);
        if (!node) return;

        // Remove all connections to this node
        for (const connection of node.connections) {
            this.removeConnection(connection.id);
        }

        // Remove the node's mesh from the scene
        if (node.mesh) {
            this.sceneManager.scene.remove(node.mesh);
        }

        // Remove from selected nodes if present
        this.selectedNodes = this.selectedNodes.filter(n => n.id !== nodeId);

        // Remove from nodes map
        this.nodes.delete(nodeId);
    }

    /**
     * Add a connection between two nodes
     * @param {NetworkNode} sourceNode - Source node
     * @param {NetworkNode} targetNode - Target node
     * @param {Object} options - Connection options
     * @returns {Connection} The created connection
     */
    addConnection(sourceNode, targetNode, options = {}) {
        // Check if nodes exist
        if (!this.nodes.has(sourceNode.id) || !this.nodes.has(targetNode.id)) {
            console.error('Cannot create connection: one or both nodes do not exist');
            return null;
        }

        // Check if connection already exists
        for (const [_, conn] of this.connections) {
            if ((conn.source.id === sourceNode.id && conn.target.id === targetNode.id) ||
                (conn.source.id === targetNode.id && conn.target.id === sourceNode.id)) {
                console.warn('Connection already exists between these nodes');
                return conn;
            }
        }

        // Create the connection
        const connection = new Connection({
            source: sourceNode,
            target: targetNode,
            ...options
        });

        // Add to connections map
        this.connections.set(connection.id, connection);

        // Add to nodes' connections lists
        sourceNode.addConnection(connection);
        targetNode.addConnection(connection);

        // Create visual representation
        connection.createMesh(this.sceneManager.scene);

        return connection;
    }

    /**
     * Remove a connection from the topology
     * @param {String} connectionId - ID of the connection to remove
     */
    removeConnection(connectionId) {
        const connection = this.connections.get(connectionId);
        if (!connection) return;

        // Remove from nodes' connections lists
        if (connection.source) {
            connection.source.removeConnection(connectionId);
        }

        if (connection.target) {
            connection.target.removeConnection(connectionId);
        }

        // Remove visual representation
        connection.remove(this.sceneManager.scene);

        // Remove from connections map
        this.connections.delete(connectionId);
    }

    /**
     * Select a node (for creating connections)
     * @param {NetworkNode} node - The node to select
     */
    selectNode(node) {
        // Check if node is already selected
        const index = this.selectedNodes.findIndex(n => n.id === node.id);

        if (index !== -1) {
            // Deselect if already selected
            this.selectedNodes.splice(index, 1);
            node.toggleSelection();
        } else {
            // Select the node
            this.selectedNodes.push(node);
            node.toggleSelection();

            // If we have two selected nodes, create a connection
            if (this.selectedNodes.length === 2) {
                this.addConnection(this.selectedNodes[0], this.selectedNodes[1]);

                // Deselect both nodes
                this.selectedNodes.forEach(n => n.toggleSelection());
                this.selectedNodes = [];
            }
        }
    }

    /**
     * Clear the entire topology
     */
    clear() {
        // Remove all connections
        for (const [id, _] of this.connections) {
            this.removeConnection(id);
        }

        // Remove all nodes
        for (const [id, _] of this.nodes) {
            this.removeNode(id);
        }
    }

    /**
     * Update all connections (e.g., after node positions change)
     */
    updateConnections() {
        for (const [_, connection] of this.connections) {
            connection.update();
        }
    }

    /**
     * Load a topology from a JSON definition
     * @param {Object} topologyData - Topology definition
     */
    loadFromJSON(topologyData) {
        // Clear existing topology
        this.clear();

        // Create nodes
        if (topologyData.nodes) {
            for (const nodeData of topologyData.nodes) {
                let node;

                // Create the appropriate node type
                switch (nodeData.type) {
                    case 'router':
                        node = new Router(nodeData);
                        break;
                    case 'switch':
                        node = new Switch(nodeData);
                        break;
                    case 'pc':
                        node = new PC(nodeData);
                        break;
                    default:
                        console.warn(`Unknown node type: ${nodeData.type}`);
                        continue;
                }

                this.addNode(node);
            }
        }

        // Create connections
        if (topologyData.connections) {
            for (const connData of topologyData.connections) {
                const sourceNode = this.nodes.get(connData.source);
                const targetNode = this.nodes.get(connData.target);

                if (sourceNode && targetNode) {
                    this.addConnection(sourceNode, targetNode, {
                        type: connData.type,
                        bandwidth: connData.bandwidth
                    });
                } else {
                    console.warn(`Cannot create connection: node not found`);
                }
            }
        }
    }

    /**
     * Export the current topology to a JSON definition
     * @returns {Object} Topology definition
     */
    exportToJSON() {
        const nodes = [];
        const connections = [];

        // Export nodes
        for (const [_, node] of this.nodes) {
            nodes.push(node.toJSON());
        }

        // Export connections
        for (const [_, connection] of this.connections) {
            connections.push(connection.toJSON());
        }

        return {
            nodes,
            connections
        };
    }

    /**
     * Load a sample topology for demonstration
     */
    loadSampleTopology() {
        const sampleTopology = {
            nodes: [
                {
                    id: 'router-1',
                    name: 'Router 1',
                    type: 'router',
                    position: { x: 0, y: 0, z: 0 },
                    ipAddress: '192.168.1.1',
                    status: 'online'
                },
                {
                    id: 'switch-1',
                    name: 'Switch 1',
                    type: 'switch',
                    position: { x: -3, y: 0, z: 0 },
                    ipAddress: '192.168.1.2',
                    status: 'online'
                },
                {
                    id: 'switch-2',
                    name: 'Switch 2',
                    type: 'switch',
                    position: { x: 3, y: 0, z: 0 },
                    ipAddress: '192.168.1.3',
                    status: 'warning'
                },
                {
                    id: 'pc-1',
                    name: 'PC 1',
                    type: 'pc',
                    position: { x: -5, y: 0, z: 2 },
                    ipAddress: '192.168.1.101',
                    status: 'online'
                },
                {
                    id: 'pc-2',
                    name: 'PC 2',
                    type: 'pc',
                    position: { x: -5, y: 0, z: -2 },
                    ipAddress: '192.168.1.102',
                    status: 'offline'
                },
                {
                    id: 'pc-3',
                    name: 'PC 3',
                    type: 'pc',
                    position: { x: 5, y: 0, z: 2 },
                    ipAddress: '192.168.1.103',
                    status: 'online'
                },
                {
                    id: 'pc-4',
                    name: 'PC 4',
                    type: 'pc',
                    position: { x: 5, y: 0, z: -2 },
                    ipAddress: '192.168.1.104',
                    status: 'online'
                }
            ],
            connections: [
                {
                    source: 'router-1',
                    target: 'switch-1',
                    type: 'ethernet',
                    bandwidth: 1000
                },
                {
                    source: 'router-1',
                    target: 'switch-2',
                    type: 'ethernet',
                    bandwidth: 1000
                },
                {
                    source: 'switch-1',
                    target: 'pc-1',
                    type: 'ethernet',
                    bandwidth: 100
                },
                {
                    source: 'switch-1',
                    target: 'pc-2',
                    type: 'ethernet',
                    bandwidth: 100
                },
                {
                    source: 'switch-2',
                    target: 'pc-3',
                    type: 'ethernet',
                    bandwidth: 100
                },
                {
                    source: 'switch-2',
                    target: 'pc-4',
                    type: 'ethernet',
                    bandwidth: 100
                }
            ]
        };

        this.loadFromJSON(sampleTopology);
    }
}
