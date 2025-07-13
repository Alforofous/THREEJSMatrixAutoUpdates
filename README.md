# Three.js Matrix Auto-Update Handling

A Three.js project demonstrating efficient matrix update handling and performance optimization for large-scale 3D scenes. This project showcases automatic matrix updates triggered by object property changes, eliminating the need for manual matrix updates and improving rendering performance.

## Features

- **Automatic Matrix Updates**: Objects automatically update their matrices when position, scale, rotation, or quaternion properties change
- **Performance Monitoring**: Real-time display of matrix update counts and memory usage
- **Large-Scale Scene Support**: Optimized for handling thousands of objects efficiently
- **Vector3 Change Detection**: Intercepts all Vector3 property changes through getter/setter properties
- **Memory Leak Prevention**: Proper cleanup mechanisms for animations and event listeners
- **Three.js scene with orbit controls and hierarchical grid objects**
- **Responsive design with performance statistics**

## Core Functionality

The main component provides automatic matrix update handling that:

- **Monitors Object Changes**: Automatically detects when object properties (position, scale, rotation, quaternion) are modified
- **Triggers Matrix Updates**: Sets `matrixNeedsUpdate` flag when changes are detected
- **Tracks Performance**: Counts matrix and world matrix updates for performance monitoring
- **Optimizes Rendering**: Only updates matrices when necessary, reducing computational overhead

### How It Works

1. **Property Interception**: Uses `Object.defineProperty` to create getter/setter properties on Vector3 objects
2. **Change Detection**: Automatically triggers callbacks when x, y, z properties are modified
3. **Matrix Flagging**: Sets `matrixNeedsUpdate` flag to true when changes are detected
4. **Performance Tracking**: Counts and displays matrix update statistics in real-time

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Performance Monitoring

The application displays real-time statistics:
- **Updated Matrices**: Count of local matrix updates
- **Updated World Matrices**: Count of world matrix updates  
- **Memory Usage**: Current memory consumption in MB

To use the matrix auto-update functionality in your own Three.js project:

```typescript
import { patchObject3DChangeListener } from './MatrixAutoUpdate';

// Patch individual objects
const object = new THREE.Object3D();
patchObject3DChangeListener(object);

// Or patch all objects in a scene
scene.traverse(object => {
    patchObject3DChangeListener(object);
});
```

## Build

To build for production:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## Testing

Run the test suite:
```bash
npm test
```

The project includes comprehensive tests for:
- Vector3 change detection
- Matrix update behavior
- Object3D change event patching
- Multiple object handling 