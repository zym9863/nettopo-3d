# NetTopo 3D

[English](README.md) | [中文](README_zh.md)

A 3D network topology visualization tool built with Three.js that allows users to create, visualize, and interact with network topologies in a three-dimensional space.

## Features

- **Interactive 3D Visualization**: View network topologies in a fully interactive 3D environment
- **Multiple Device Types**: Create routers, switches, and PCs with detailed 3D models
- **Device Connections**: Easily connect network devices with visual links
- **Sample Topology**: Load a pre-configured sample topology for demonstration
- **Custom Naming**: Name your devices for better organization
- **Selection & Highlighting**: Select devices to highlight them for connection or inspection
- **Modern UI**: Clean, responsive interface with intuitive controls

## Technologies Used

- **Three.js**: For 3D rendering and scene management
- **JavaScript (ES6+)**: Core programming language
- **HTML5/CSS3**: Structure and styling
- **Font Awesome**: For UI icons

## Getting Started

### Prerequisites

- A modern web browser with WebGL support (Chrome, Firefox, Safari, Edge)
- No server-side requirements - runs entirely in the browser

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/zym9863/nettopo-3d.git
   ```

2. Open `index.html` in your web browser

Alternatively, you can use a local development server:

```
npx http-server
```

Then navigate to `http://localhost:8080` in your browser.

## Usage

### Adding Devices

1. Click on one of the device buttons in the right panel:
   - Router
   - Switch
   - PC

2. The device will be added to the scene at a random position

### Connecting Devices

1. Click the "Connect Devices" button to enter connection mode
2. Click on the first device you want to connect
3. Click on the second device to create a connection
4. The connection mode will automatically exit after creating a connection

### Loading a Sample Topology

- Click the "Load Sample" button to load a pre-configured network topology

### Clearing the Topology

- Click the "Clear All" button to remove all devices and connections

### Navigation

- **Rotate**: Click and drag with the left mouse button
- **Pan**: Click and drag with the right mouse button or use the middle mouse button
- **Zoom**: Use the mouse wheel

## Project Structure

```
nettopo-3d/
├── css/
│   └── style.css              # Main stylesheet
├── js/
│   ├── models/                # Network device models
│   │   ├── NetworkNode.js     # Base class for all network devices
│   │   ├── Router.js          # Router implementation
│   │   ├── Switch.js          # Switch implementation
│   │   ├── PC.js              # PC implementation
│   │   └── Connection.js      # Connection between devices
│   ├── utils/
│   │   └── LabelUtils.js      # Utilities for creating 3D text labels
│   ├── SceneManager.js        # Manages the Three.js scene
│   ├── TopologyManager.js     # Manages the network topology
│   ├── UIController.js        # Handles UI interactions
│   └── main.js                # Application entry point
└── index.html                 # Main HTML file
```

## Customization

### Adding New Device Types

1. Create a new class that extends `NetworkNode` in the `js/models/` directory
2. Implement the `createMesh()` method to define the 3D representation
3. Update the UI to include buttons for the new device type

### Modifying Device Appearance

Edit the corresponding device class file (e.g., `Router.js`, `Switch.js`, `PC.js`) to change the 3D model appearance.

### Changing Colors

The color scheme can be modified in the `css/style.css` file by updating the CSS variables in the `:root` selector.

## Future Enhancements

- Save and load custom topologies
- Export topology as JSON
- Import topologies from network management systems
- Add more device types (firewall, load balancer, etc.)
- Implement network simulation capabilities
- Add device configuration panels

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Three.js](https://threejs.org/) for the 3D rendering engine
- [Font Awesome](https://fontawesome.com/) for the icons
