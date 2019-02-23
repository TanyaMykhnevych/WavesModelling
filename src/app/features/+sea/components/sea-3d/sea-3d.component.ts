import { Component, ViewChild, ElementRef, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { SeaOperationsService } from '../../services/sea-operations.service';
import { IOptions } from '../../models/options';
import { DEFAULT_SEA_2D_OPTIONS, DEFAULT_SEA } from '../../constants/sea.constant';
import { ISea, ISea2D } from '../../models/sea';
import { SeaDrawService } from '../../services/sea-draw.service';
import { Handler } from '../../models/handlers.enum';
import * as THREE from 'three';

@Component({
  selector: 'app-sea-3d',
  templateUrl: './sea-3d.component.html',
  styleUrls: ['./sea-3d.component.css']
})
export class Sea3DComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas3d') canvas3d: ElementRef;
  public context: CanvasRenderingContext2D;

  public camera: THREE.OrthographicCamera;
  public scene: THREE.Scene;
  public light: THREE.DirectionalLight;
  public geometry: THREE.BufferGeometry;
  public renderer: THREE.WebGLRenderer;


  public cameraRange: number;
  public lightRange: number;

  public sea: ISea2D = DEFAULT_SEA;
  public o: any;
  public timerId;
  public playPauseIcon: string = 'play_arrow';
  private _options: IOptions = DEFAULT_SEA_2D_OPTIONS;
  public _handler: Handler;

  public constructor(
    private _seaOperationsService: SeaOperationsService,
    private _seaDrawService: SeaDrawService,
  ) { }

  public ngOnInit(): void {
    this._initSea();

    this.camera = new THREE.OrthographicCamera(-this.options.N / 2, this.options.N / 2, this.options.N / 2, -this.options.N / 2, 1, 1000);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xbfd1e5);

    this.light = new THREE.DirectionalLight(0xffffff, 1.1);
    this.light.castShadow = true;
    this.scene.add(this.light); this.geometry = new THREE.BufferGeometry();

    let attr = new THREE.BufferAttribute(this._initVertices(), 3);
    attr.dytamic = true;

    this.geometry.addAttribute('position', attr);

    let seaMaterial = new THREE.MeshPhongMaterial({ color: 0x00FFFF });
    let seaMesh = new THREE.Mesh(this.geometry, seaMaterial);
    seaMesh.receiveShadow = true;
    seaMesh.castShadow = true;
    this.scene.add(seaMesh);

    // renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas3d.nativeElement });
    this.renderer.setSize(this.options.N, this.options.N);
    this.renderer.shadowMap.enabled = true;
  }

  @Input() public set options(options: IOptions) {
    this._seaOperationsService.sea = this.sea;
    this._options = options;
    this._initSea();
  }

  public get options() {
    return this._options;
  }

  @Input() public set handler(handler: Handler) {
    this._handler = handler;
  }

  public get handler() {
    return this._handler;
  }

  public get context3d(): CanvasRenderingContext2D {
    return (<HTMLCanvasElement>this.canvas3d.nativeElement).getContext('2d');
  }

  public ngAfterViewInit(): void {    
    this._draw();
  }

  public ngOnDestroy(): void {
    this._stop();
  }

  public addIsle(isle): void {
    let isleMaterial = new THREE.MeshPhongMaterial({color: 0x00a000});
    let mesh = null;

    if (isle.type === 'rect') {
        let geometry = new THREE.BoxGeometry(isle.w, isle.h, 4);
        mesh = new THREE.Mesh(geometry, isleMaterial);
        mesh.position.x = isle.c0 + isle.w / 2;
        mesh.position.y = this.options.N - isle.r0 - isle.h / 2;

    } else if (isle.type === 'line') {
        let hypot = Math.hypot(isle.r - isle.r0, isle.c - isle.c0);
        let geometry = new THREE.BoxGeometry(hypot, isle.width, 4);
        mesh = new THREE.Mesh(geometry, isleMaterial);
        mesh.position.x = (isle.c0 + isle.c) / 2;
        mesh.position.y = this.options.N - (isle.r0 + isle.r) / 2;
        let alpha = Math.atan2(isle.r - isle.r0, isle.c - isle.c0);
        mesh.rotation.z = -alpha;
    }

    mesh.receiveShadow = true;
    mesh.castShadow = true;
    this.scene.add(mesh);
}

  private _initSea(): void {
    this._seaOperationsService.initSea(this.options);
  }

  private _stop(): void {
    clearInterval(this.timerId);
    this.timerId = null;
    this.playPauseIcon = 'play_arrow';
  }

  private _initVertices(): Float32Array {
    let d = this.options.D;
    let v = [];
    for (let r = 0; r < this.options.N - d; r += d) {
      for (let c = 0; c < this.options.N - d; c += d) {
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

  private _draw(): void {
    let amp = 2*9;// this.options.Kvis3d;

    const optz = {
      cameraY: 0,
      cameraZ: this.options.N * Math.cos(this.cameraRange),
      lightX: this.lightRange * this.options.N / 2,
      lineIsleWidth: 1,               // width of the line isle
      meterRadius: 20,
    }

    let half = this.options.N / 2 | 0;
    this.camera.position.set(half, half + optz.cameraY, optz.cameraZ);
    this.camera.lookAt(half, half, 0);

    this.light.position.set(optz.lightX, half, this.options.N);

    let v = this.geometry.getAttribute('position').array;
    let d = this.options.D;
    let i = 0;
    for (let r_ = 0; r_ < this.options.N - d; r_ += d) {
      let r = this.options.N - d - r_;
      for (let c = 0; c < this.options.N - d; c += d) {
        // 1
        // v[i] = c;
        // v[i+1] = r_;
        v[i + 2] = this.sea.water[r][c].x * amp;
        // 2
        // v[i+3] = c+d;
        // v[i+4] = r_;
        v[i + 5] = this.sea.water[r - d][c].x * amp;
        // 3
        // v[i+6] = c;
        // v[i+7] = r_+d;
        v[i + 8] = this.sea.water[r][c + d].x * amp;
        // 3
        // v[i+9] = c;
        // v[i+10] = r_+d;
        v[i + 11] = this.sea.water[r][c + d].x * amp;
        // 2
        // v[i+12] = c+d;
        // v[i+13] = r_;
        v[i + 14] = this.sea.water[r - d][c].x * amp;
        // 4
        // v[i+15] = c+d;
        // v[i+16] = r_+d;
        v[i + 17] = this.sea.water[r - d][c + d].x * amp;
        i += 18;
      }
    }
    this.geometry.getAttribute('position').needsUpdate = true;
    this.geometry.computeVertexNormals();
    this.renderer.render(this.scene, this.camera);
  }
}
