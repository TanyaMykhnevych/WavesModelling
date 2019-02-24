import { Component, ViewChild, ElementRef, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { SeaOperationsService } from '../../services/sea-operations.service';
import { IOptions } from '../../models/options';
import { DEFAULT_SEA_2D_OPTIONS, DEFAULT_SEA, DEFAULT_3D_SETTINGS } from '../../constants/sea.constant';
import { ISea2D } from '../../models/sea';
import { SeaDrawService } from '../../services/sea-draw.service';
import { Handler } from '../../models/handlers.enum';
import * as THREE from 'three';
import { IOptions3D } from '../../models/options3D';
import { ISettings3D } from '../../models/settings3D';

@Component({
  selector: 'app-sea-2d',
  templateUrl: './sea-2d.component.html',
  styleUrls: ['./sea-2d.component.css']
})
export class Sea2DComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas2d') canvas2d: ElementRef;
  @ViewChild('canvas1d') canvas1d: ElementRef;
  public context: CanvasRenderingContext2D;
  public canvasData: ImageData;
  public sea: ISea2D = DEFAULT_SEA;
  public o: any;
  public timerId;
  public playPauseIcon: string = 'play_arrow';
  public _handler: Handler;

  @ViewChild('canvas3d') canvas3d: ElementRef;

  public camera: THREE.OrthographicCamera;
  public scene: THREE.Scene;
  public light: THREE.DirectionalLight;
  public geometry: THREE.BufferGeometry;
  public renderer: THREE.WebGLRenderer;

  private _settings3D: ISettings3D = DEFAULT_3D_SETTINGS;
  private _options: IOptions = DEFAULT_SEA_2D_OPTIONS;
  private _optionsZ: IOptions3D = {
    cameraY: 0,
    cameraZ: this.options.N * Math.cos(this._settings3D.cameraRange),
    lightX: this._settings3D.lightRange * this.options.N / 2,
    lineIsleWidth: 1,
    meterRadius: 20,
  };

  public constructor(
    private _seaOperationsService: SeaOperationsService,
    private _seaDrawService: SeaDrawService,
  ) { }

  public ngOnInit(): void {
    this._initSea();
    this._init3DSea();
  }

  @Input() public set options(options: IOptions) {
    this._seaOperationsService.sea = this.sea;
    this._options = options;
    this._initSea();
    // this.draw();
    // this._draw3D();
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

  public get context1d(): CanvasRenderingContext2D {
    return (<HTMLCanvasElement>this.canvas1d.nativeElement).getContext('2d');
  }

  public get context2d(): CanvasRenderingContext2D {
    return (<HTMLCanvasElement>this.canvas2d.nativeElement).getContext('2d');
  }

  public ngAfterViewInit(): void {
    this.canvasData = this.context2d.getImageData(0, 0, this.options.N, this.options.N);
    this.draw();
    this._draw3D();
  }

  public ngOnDestroy(): void {
    this._stop();
  }

  public clear(): void {
    this._seaOperationsService.clearSea();
    this._initSea();
    this.context2d.clearRect(0, 0, this.options.N, this.options.N);
    this.canvasData = this.context2d.getImageData(0, 0, this.options.N, this.options.N);
    this.draw();
  }

  public play(): void {
    if (this.timerId) {
      this._stop();
    } else {
      this.playPauseIcon = 'pause';
      this.timerId = setInterval(() => {
        this._seaOperationsService.step(this.options);
        this.draw();
        this._draw3D();
      }, 50);
    }
  }

  public onMouseDown(event: MouseEvent): void {
    switch (this._handler) {
      case Handler.Line: {
        this.o = { type: "line", c0: event.offsetX, r0: event.offsetY, width: 1/*optz.lineIsleWidth*/ };
        break;
      }
      case Handler.Oscil: {
        let c = event.offsetX;
        let r = event.offsetY;
        if (this.sea.water[r][c].free) {
          this._seaOperationsService.addOscillator(r, c, this.options.OMEGA, 1);
        }
        this.draw();
        break;
      }
      case Handler.Rect: {
        this.o = { type: "rect", c0: event.offsetX, r0: event.offsetY, w: 0, h: 0 };
        break;
      }
      case Handler.Meter: {
        break;
      }
      default:
        break;
    }
  }

  public onMouseUp(event: MouseEvent): void {
    switch (this._handler) {
      case Handler.Line: {
        let isle = this.o;
        if (isle) {
          if (isle.c < isle.c0) {
            [isle.c, isle.c0] = [isle.c0, isle.c];
            [isle.r, isle.r0] = [isle.r0, isle.r];
          }
          let canvasData = this.context1d.getImageData(0, 0, this.options.N, this.options.N);
          this._seaOperationsService.getRocksFromCanvasData(canvasData);
          this.sea.isles.push(isle);
          this.draw();
          this._addIsle3D(isle);
          this._draw3D();
          let ctx = this.context1d;
          ctx.clearRect(0, 0, this.options.N, this.options.N);
          this.o = null;
        }
        break;
      }
      case Handler.Rect: {
        if (this.o) {
          let canvasData = this.context1d.getImageData(0, 0, this.options.N, this.options.N);
          this._seaOperationsService.getRocksFromCanvasData(canvasData);
          this.sea.isles.push(this.o);
          this.draw();
          this._addIsle3D(this.o);
          this._draw3D();
          let ctx = this.context1d;
          ctx.clearRect(0, 0, this.options.N, this.options.N);
          this.o = null;
        }
        break;
      }
      case Handler.Meter: {
        break;
      }
      default:
        break;
    }
  }

  public onMouseMove(event: MouseEvent): void {
    switch (this._handler) {
      case Handler.Line: {
        if (this.o) {
          this.o.c = event.offsetX;
          this.o.r = event.offsetY;

          this.context = this.context1d;
          this.context.strokeStyle = "white";
          this.context.clearRect(0, 0, this.options.N, this.options.N);

          this.context.lineWidth = this.o.width;
          this.context.beginPath();
          this.context.moveTo(this.o.c0, this.o.r0);
          this.context.lineTo(this.o.c, this.o.r);
          this.context.stroke();
        }
        break;
      }
      case Handler.Rect: {
        if (this.o) {
          this.o.w = event.offsetX - this.o.c0;
          this.o.h = event.offsetY - this.o.r0;

          let ctx = this.context1d;
          ctx.fillStyle = "lightblue";
          ctx.clearRect(0, 0, this.options.N, this.options.N);
          ctx.fillRect(this.o.c0, this.o.r0, this.o.w, this.o.h);
        }
        break;
      }
      case Handler.Meter: {
        break;
      }
      default:
        break;
    }
  }

  public draw(): any {
    this.context = (<HTMLCanvasElement>this.canvas2d.nativeElement).getContext('2d');
    this._seaDrawService.draw(this.sea, this.options, this.canvasData);
    this.context.putImageData(this.canvasData, 0, 0);
  }

  public draw1(): void {
    let ctx = this.context1d;
    this._seaDrawService.draw1(this.sea, this.options, ctx);
  }

  public handleSettings3DChanges(settings: ISettings3D): void {
    this._optionsZ.cameraY = this.options.N * Math.sin(settings.cameraRange);
    this._optionsZ.cameraZ = this.options.N * Math.cos(settings.cameraRange);
    this._optionsZ.lightX = settings.lightRange * this.options.N / 2;
    this._draw3D();
  }

  private _initSea(): void {
    this._seaOperationsService.initSea(this.options);
  }

  private _stop(): void {
    clearInterval(this.timerId);
    this.timerId = null;
    this.playPauseIcon = 'play_arrow';
  }

  private _initVertices3D(): Float32Array {
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

  private _draw3D(): void {
    let amp = 2 * this.options.kvisRange;

    const optz = this._optionsZ;

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
        v[i] = c;
        v[i+1] = r_;
        v[i + 2] = this.sea.water[r][c].x * amp;
        // 2
        v[i+3] = c+d;
        v[i+4] = r_;
        v[i + 5] = this.sea.water[r - d][c].x * amp;
        // 3
        v[i+6] = c;
        v[i+7] = r_+d;
        v[i + 8] = this.sea.water[r][c + d].x * amp;
        // 3
        v[i+9] = c;
        v[i+10] = r_+d;
        v[i + 11] = this.sea.water[r][c + d].x * amp;
        // 2
        v[i+12] = c+d;
        v[i+13] = r_;
        v[i + 14] = this.sea.water[r - d][c].x * amp;
        // 4
        v[i+15] = c+d;
        v[i+16] = r_+d;
        v[i + 17] = this.sea.water[r - d][c + d].x * amp;
        i += 18;
      }
    }
    this.geometry.getAttribute('position').needsUpdate = true;
    this.geometry.computeVertexNormals();
    this.renderer.render(this.scene, this.camera);
  }


  private _init3DSea(): void {
    this.camera = new THREE.OrthographicCamera(-this.options.N / 2, this.options.N / 2, this.options.N / 2, -this.options.N / 2, 1, 1000);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xbfd1e5);

    this.light = new THREE.DirectionalLight(0xffffff, 1.1);
    this.light.castShadow = true;
    this.scene.add(this.light); this.geometry = new THREE.BufferGeometry();

    let attr = new THREE.BufferAttribute(this._initVertices3D(), 3);
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

  private _addIsle3D(isle): void {
    let isleMaterial = new THREE.MeshPhongMaterial({ color: 0x00a000 });
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
}
