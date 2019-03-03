import { Injectable, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { IOptions } from '../models/options';
import { IDisplay3DParameters } from '../models/display-3d-parameters';

@Injectable()
export class Sea3DOperationsService {

    constructor() { }

    public init3DSea(options: IOptions, displayParams: IDisplay3DParameters, canvas3d: ElementRef): void {
        displayParams.camera = new THREE.OrthographicCamera(-options.N / 2, options.N / 2, options.N / 2, -options.N / 2, 1, 1000);

        displayParams.scene = new THREE.Scene();
        displayParams.scene.background = new THREE.Color(0xbfd1e5);

        displayParams.light = new THREE.DirectionalLight(0xffffff, 1.1);
        displayParams.light.castShadow = true;
        displayParams.scene.add(displayParams.light);

        let attr = new THREE.BufferAttribute(this.initVertices3D(options), 3);
        attr.dytamic = true;

        displayParams.geometry = new THREE.BufferGeometry();
        displayParams.geometry.addAttribute('position', attr);

        let seaMaterial = new THREE.MeshPhongMaterial({ color: 0x00FFFF });
        let seaMesh = new THREE.Mesh(displayParams.geometry, seaMaterial);
        seaMesh.receiveShadow = true;
        seaMesh.castShadow = true;
        displayParams.scene.add(seaMesh);

        // renderer
        displayParams.renderer = new THREE.WebGLRenderer({ canvas: canvas3d.nativeElement });
        displayParams.renderer.setSize(options.N, options.N);
        displayParams.renderer.shadowMap.enabled = true;
    }

    public initVertices3D(options: IOptions): Float32Array {
        let d = options.D;
        let v = [];
        for (let r = 0; r < options.N - d; r += d) {
            for (let c = 0; c < options.N - d; c += d) {
                // 1
                v.push(c);
                v.push(r);
                v.push(0);
                // 2
                v.push(c + d);
                v.push(r);
                v.push(0);
                // 3
                v.push(c);
                v.push(r + d);
                v.push(0);

                //3
                v.push(c);
                v.push(r + d);
                v.push(0);
                // 2
                v.push(c + d);
                v.push(r);
                v.push(0);
                // 4
                v.push(c + d);
                v.push(r + d);
                v.push(0);
            }
        }
        return new Float32Array(v);
    }

    public getIsleMeshToAdd(isle, options: IOptions): THREE.Mesh {
        let isleMaterial = new THREE.MeshPhongMaterial({ color: 0x00a000 });
        let mesh = null;

        if (isle.type === 'rect') {
            let geometry = new THREE.BoxGeometry(isle.w, isle.h, 4);
            mesh = new THREE.Mesh(geometry, isleMaterial);
            mesh.position.x = isle.c0 + isle.w / 2;
            mesh.position.y = options.N - isle.r0 - isle.h / 2;

        } else if (isle.type === 'line') {
            let hypot = Math.hypot(isle.r - isle.r0, isle.c - isle.c0);
            let geometry = new THREE.BoxGeometry(hypot, isle.width, 4);
            mesh = new THREE.Mesh(geometry, isleMaterial);
            mesh.position.x = (isle.c0 + isle.c) / 2;
            mesh.position.y = options.N - (isle.r0 + isle.r) / 2;
            let alpha = Math.atan2(isle.r - isle.r0, isle.c - isle.c0);
            mesh.rotation.z = -alpha;
        }

        mesh.receiveShadow = true;
        mesh.castShadow = true;

        return mesh;
    }

}
