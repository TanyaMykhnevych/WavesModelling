import * as THREE from 'three';

export interface IDisplay3DParameters {
    camera?: THREE.OrthographicCamera;
    scene?: THREE.Scene;
    light?: THREE.DirectionalLight;
    geometry?: THREE.BufferGeometry;
    renderer?: THREE.WebGLRenderer;
}