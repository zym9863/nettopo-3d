/**
 * Handles user interface interactions
 */
class UIController {
    /**
     * Create a UI controller
     * @param {TopologyManager} topologyManager - Reference to the topology manager
     * @param {SceneManager} sceneManager - Reference to the scene manager
     */
    constructor(topologyManager, sceneManager) {
        this.topologyManager = topologyManager;
        this.sceneManager = sceneManager;
        
        // UI elements
        this.addRouterBtn = document.getElementById('add-router');
        this.addSwitchBtn = document.getElementById('add-switch');
        this.addPCBtn = document.getElementById('add-pc');
        this.connectDevicesBtn = document.getElementById('connect-devices');
        this.loadSampleBtn = document.getElementById('load-sample');
        this.clearTopologyBtn = document.getElementById('clear-topology');
        
        // State
        this.connectMode = false;
        
        this.init();
    }

    /**
     * Initialize event listeners
     */
    init() {
        // Add device buttons
        this.addRouterBtn.addEventListener('click', () => this.addDevice('router'));
        this.addSwitchBtn.addEventListener('click', () => this.addDevice('switch'));
        this.addPCBtn.addEventListener('click', () => this.addDevice('pc'));
        
        // Connect devices button
        this.connectDevicesBtn.addEventListener('click', () => this.toggleConnectMode());
        
        // Load sample topology button
        this.loadSampleBtn.addEventListener('click', () => this.topologyManager.loadSampleTopology());
        
        // Clear topology button
        this.clearTopologyBtn.addEventListener('click', () => this.topologyManager.clear());
        
        // Listen for node selection events
        this.sceneManager.container.addEventListener('node-selected', (event) => {
            this.handleNodeSelected(event.detail.node);
        });
    }

    /**
     * Add a new device to the topology
     * @param {String} type - Device type ('router', 'switch', 'pc')
     */
    addDevice(type) {
        // Generate a random position within a reasonable range
        const position = {
            x: (Math.random() - 0.5) * 10,
            y: 0,
            z: (Math.random() - 0.5) * 10
        };
        
        // Create the appropriate node type
        let node;
        switch (type) {
            case 'router':
                node = new Router({
                    name: `Router ${this.getNextDeviceNumber('router')}`,
                    position
                });
                break;
            case 'switch':
                node = new Switch({
                    name: `Switch ${this.getNextDeviceNumber('switch')}`,
                    position
                });
                break;
            case 'pc':
                node = new PC({
                    name: `PC ${this.getNextDeviceNumber('pc')}`,
                    position
                });
                break;
            default:
                console.error(`Unknown device type: ${type}`);
                return;
        }
        
        // Add the node to the topology
        this.topologyManager.addNode(node);
    }

    /**
     * Get the next available device number for a given type
     * @param {String} type - Device type
     * @returns {Number} Next available number
     */
    getNextDeviceNumber(type) {
        let maxNumber = 0;
        
        for (const [_, node] of this.topologyManager.nodes) {
            if (node.type === type) {
                // Extract number from name (e.g., "Router 1" -> 1)
                const match = node.name.match(/\d+$/);
                if (match) {
                    const number = parseInt(match[0], 10);
                    maxNumber = Math.max(maxNumber, number);
                }
            }
        }
        
        return maxNumber + 1;
    }

    /**
     * Toggle connection mode
     */
    toggleConnectMode() {
        this.connectMode = !this.connectMode;
        
        if (this.connectMode) {
            this.connectDevicesBtn.textContent = 'Cancel Connection';
            this.connectDevicesBtn.style.backgroundColor = '#f44336';
        } else {
            this.connectDevicesBtn.textContent = 'Connect Devices';
            this.connectDevicesBtn.style.backgroundColor = '';
            
            // Clear any selected nodes
            this.topologyManager.selectedNodes.forEach(node => node.toggleSelection());
            this.topologyManager.selectedNodes = [];
        }
    }

    /**
     * Handle node selection
     * @param {NetworkNode} node - The selected node
     */
    handleNodeSelected(node) {
        if (this.connectMode) {
            this.topologyManager.selectNode(node);
            
            // If we've selected two nodes, exit connect mode
            if (this.topologyManager.selectedNodes.length === 0) {
                this.toggleConnectMode();
            }
        }
    }
}
