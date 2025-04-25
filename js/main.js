/**
 * Main application entry point
 */
document.addEventListener('DOMContentLoaded', () => {
    // Get the container element
    const container = document.getElementById('scene-container');
    
    // Create the scene manager
    const sceneManager = new SceneManager(container);
    
    // Create the topology manager
    const topologyManager = new TopologyManager(sceneManager);
    
    // Create the UI controller
    const uiController = new UIController(topologyManager, sceneManager);
    
    // Load a sample topology
    topologyManager.loadSampleTopology();
    
    // Expose to window for debugging
    window.app = {
        sceneManager,
        topologyManager,
        uiController
    };
    
    console.log('NetTopo 3D initialized');
});
