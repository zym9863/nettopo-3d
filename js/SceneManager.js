/**
 * Manages the Three.js scene
 */
class SceneManager {
    /**
     * Create a scene manager
     * @param {HTMLElement} container - The container element for the scene
     */
    constructor(container) {
        this.container = container;
        this.width = container.clientWidth;
        this.height = container.clientHeight;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.raycaster = null;
        this.mouse = null;

        this.init();
    }

    /**
     * Initialize the Three.js scene
     */
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e); // Darker blue background

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, // Field of view
            this.width / this.height, // Aspect ratio
            0.1, // Near clipping plane
            1000 // Far clipping plane
        );
        this.camera.position.set(0, 5, 10);

        // Create renderer with improved settings
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.container.appendChild(this.renderer.domElement);

        // Create orbit controls with improved settings
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.2;
        this.controls.rotateSpeed = 0.7;
        this.controls.zoomSpeed = 1.2;

        // Create raycaster for mouse interaction
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // Add lights
        this.addLights();

        // Add grid
        this.addGrid();

        // Add event listeners
        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.renderer.domElement.addEventListener('click', this.onClick.bind(this));

        // Start animation loop
        this.animate();
    }

    /**
     * Add lights to the scene
     */
    addLights() {
        // Ambient light - slightly brighter
        const ambientLight = new THREE.AmbientLight(0x606060, 0.6);
        this.scene.add(ambientLight);

        // Main directional light with shadows
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;

        // Improve shadow quality
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.bias = -0.0001;

        const d = 15;
        directionalLight.shadow.camera.left = -d;
        directionalLight.shadow.camera.right = d;
        directionalLight.shadow.camera.top = d;
        directionalLight.shadow.camera.bottom = -d;

        this.scene.add(directionalLight);

        // Secondary fill light
        const fillLight = new THREE.DirectionalLight(0x8080ff, 0.4);
        fillLight.position.set(-5, 3, -5);
        this.scene.add(fillLight);

        // Hemisphere light for better color blending
        const hemisphereLight = new THREE.HemisphereLight(0xadd8e6, 0x062745, 0.7);
        this.scene.add(hemisphereLight);
    }

    /**
     * Add a grid to the scene
     */
    addGrid() {
        // Main grid - larger and more detailed
        const mainGrid = new THREE.GridHelper(30, 30, 0x444466, 0x222244);
        mainGrid.material.opacity = 0.7;
        mainGrid.material.transparent = true;
        this.scene.add(mainGrid);

        // Secondary grid - for better visual reference
        const secondaryGrid = new THREE.GridHelper(30, 6, 0x4444aa, 0x4444aa);
        secondaryGrid.material.opacity = 0.3;
        secondaryGrid.material.transparent = true;
        secondaryGrid.position.y = 0.002; // Slightly above the main grid to avoid z-fighting
        this.scene.add(secondaryGrid);

        // Add a subtle ground plane
        const groundGeometry = new THREE.PlaneGeometry(60, 60);
        const groundMaterial = new THREE.MeshPhongMaterial({
            color: 0x0a0a1a,
            transparent: true,
            opacity: 0.6,
            shininess: 10
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
        ground.position.y = -0.01; // Slightly below the grid
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    /**
     * Handle window resize
     */
    onWindowResize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.width, this.height);
    }

    /**
     * Handle mouse click
     * @param {MouseEvent} event - Mouse event
     */
    onClick(event) {
        // Calculate mouse position in normalized device coordinates
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / this.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / this.height) * 2 + 1;

        // Update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            // Find the first intersected object that has a node reference
            for (const intersect of intersects) {
                // Traverse up the parent chain to find an object with userData.node
                let object = intersect.object;
                while (object && !object.userData.node) {
                    object = object.parent;
                }

                if (object && object.userData.node) {
                    // Dispatch a custom event with the selected node
                    const event = new CustomEvent('node-selected', {
                        detail: { node: object.userData.node }
                    });
                    this.container.dispatchEvent(event);
                    break;
                }
            }
        }
    }

    /**
     * Animation loop
     */
    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Update controls
        this.controls.update();

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}
