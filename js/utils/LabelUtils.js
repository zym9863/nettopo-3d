/**
 * Utility functions for creating high-quality text labels in 3D space
 */
class LabelUtils {
    /**
     * Create a high-quality text label
     * @param {String} text - The text to display
     * @param {Object} options - Configuration options
     * @param {Number} options.fontSize - Font size (default: 24)
     * @param {String} options.fontFace - Font face (default: 'Arial')
     * @param {String} options.fontWeight - Font weight (default: 'Bold')
     * @param {String} options.fontColor - Font color (default: '#ffffff')
     * @param {String} options.backgroundColor - Background color (default: null for transparent)
     * @param {Number} options.padding - Padding around text (default: 10)
     * @param {Number} options.canvasWidth - Canvas width (default: 512)
     * @param {Number} options.canvasHeight - Canvas height (default: 256)
     * @returns {THREE.Sprite} A sprite containing the text
     */
    static createTextLabel(text, options = {}) {
        // Set default options
        const fontSize = options.fontSize || 24;
        const fontFace = options.fontFace || 'Arial';
        const fontWeight = options.fontWeight || 'Bold';
        const fontColor = options.fontColor || '#ffffff';
        const backgroundColor = options.backgroundColor || null;
        const padding = options.padding || 10;
        const canvasWidth = options.canvasWidth || 512;
        const canvasHeight = options.canvasHeight || 256;

        // Create canvas for the label
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Set high DPI for better text rendering
        const devicePixelRatio = window.devicePixelRatio || 1;
        if (devicePixelRatio > 1) {
            canvas.width = canvasWidth * devicePixelRatio;
            canvas.height = canvasHeight * devicePixelRatio;
            context.scale(devicePixelRatio, devicePixelRatio);
        }

        // Clear canvas
        context.clearRect(0, 0, canvasWidth, canvasHeight);

        // Draw background if specified
        if (backgroundColor) {
            context.fillStyle = backgroundColor;
            context.fillRect(0, 0, canvasWidth, canvasHeight);
        }

        // Draw text with improved quality
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.font = `${fontWeight} ${fontSize}px ${fontFace}`;

        // Add text outline for better visibility without background
        context.strokeStyle = '#000000';
        context.lineWidth = 3;
        context.lineJoin = 'round';
        context.miterLimit = 2;
        context.strokeText(text, canvasWidth / 2, canvasHeight / 2);

        // Apply stronger shadow for better text quality
        context.shadowColor = '#000000';
        context.shadowBlur = 4;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        // Draw text in the center of the canvas
        context.fillStyle = fontColor;
        context.fillText(text, canvasWidth / 2, canvasHeight / 2);

        // Create texture and sprite
        const texture = new THREE.CanvasTexture(canvas);

        // Use better texture filtering for sharper text
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.needsUpdate = true;

        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });

        const sprite = new THREE.Sprite(spriteMaterial);

        // Calculate aspect ratio to maintain text proportions
        const aspectRatio = canvasWidth / canvasHeight;
        sprite.scale.set(aspectRatio * 2, 2, 1);

        return sprite;
    }

    /**
     * Create a label for a network node
     * @param {String} name - Node name
     * @param {Number} yOffset - Vertical offset for the label
     * @returns {THREE.Sprite} A sprite containing the node name
     */
    static createNodeLabel(name, yOffset = 0.5) {
        const label = this.createTextLabel(name, {
            fontSize: 28,
            fontColor: '#ffffff',
            backgroundColor: null, // No background
            canvasWidth: 512,
            canvasHeight: 128
        });

        label.position.set(0, yOffset, 0);
        return label;
    }

    /**
     * Create a label for a connection
     * @param {String} text - Connection information
     * @returns {THREE.Sprite} A sprite containing the connection info
     */
    static createConnectionLabel(text) {
        const label = this.createTextLabel(text, {
            fontSize: 20,
            fontColor: '#ffffff',
            backgroundColor: null, // No background
            canvasWidth: 256,
            canvasHeight: 64
        });

        return label;
    }
}
