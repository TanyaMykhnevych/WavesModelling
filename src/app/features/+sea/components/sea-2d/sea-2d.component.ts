import { Component, ViewChild, ElementRef, AfterViewInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Sea2DOperationsService } from '../../services/sea-2d-operations.service';
import { IOptions } from '../../models/options';
import { DEFAULT_SEA_2D_OPTIONS, DEFAULT_SEA, DEFAULT_3D_SETTINGS, DEFAULT_SEA_3D_OPTIONS } from '../../constants/sea.constant';
import { ISea2D, ISea } from '../../models/sea';
import { SeaDrawService } from '../../services/sea-draw.service';
import { Handler } from '../../models/handlers.enum';
import { IOptions3D } from '../../models/options3D';
import { ISettings3D } from '../../models/settings3D';
import { Sea3DOperationsService } from '../../services/sea-3d-operations.service';
import { IDisplay3DParameters } from '../../models/display-3d-parameters';

@Component({
  selector: 'app-sea-2d',
  templateUrl: './sea-2d.component.html',
  styleUrls: ['./sea-2d.component.css']
})
export class Sea2DComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas1d') canvas1d: ElementRef;
  @ViewChild('canvas2d') canvas2d: ElementRef;
  @ViewChild('canvas3d') canvas3d: ElementRef;

  @Output() public seaChanges: EventEmitter<ISea> = new EventEmitter<ISea>();

  public context: CanvasRenderingContext2D;
  public canvasData: ImageData;
  public sea: ISea2D = DEFAULT_SEA;
  public o: any;
  public timerId;
  public playPauseIcon: string = 'play_arrow';
  public _handler: Handler;
  public display3DParams: IDisplay3DParameters = {};
  public energy: number;

  private _settings3D: ISettings3D = DEFAULT_3D_SETTINGS;
  private _options: IOptions = DEFAULT_SEA_2D_OPTIONS;
  private _optionsZ: IOptions3D = DEFAULT_SEA_3D_OPTIONS;

  public constructor(
    private _sea2DOperationsService: Sea2DOperationsService,
    private _seaDrawService: SeaDrawService,
    private _sea3DOperationsService: Sea3DOperationsService,
  ) { }

  public ngOnInit(): void {
    this._initSea();
    this._init3DSea();
  }

  @Input() public set options(options: IOptions) {
    this._sea2DOperationsService.sea = this.sea;
    Object.assign(this._options, options);
    this.clear();
  }

  public get options() { return this._options; }

  @Input() public set handler(handler: Handler) {
    this._handler = handler;
  }

  public get handler() { return this._handler; }

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
    this._sea2DOperationsService.clearSea();
    this.seaChanges.emit(this.sea);
    this._initSea();
    this._init3DSea();
    this.context2d.clearRect(0, 0, this.options.N, this.options.N);
    this.canvasData = this.context2d.getImageData(0, 0, this.options.N, this.options.N);
    this.draw();
    this._draw3D();
  }

  public play(): void {
    if (this.timerId) {
      this._stop();
    } else {
      this.playPauseIcon = 'pause';
      this.timerId = setInterval(() => {
        this._sea2DOperationsService.step(this.options);
        this.draw();
        this._draw3D();
      }, 50);
    }
  }

  public onMouseDown(event: MouseEvent): void {
    switch (this._handler) {
      case Handler.Line: {
        this.o = { type: "line", c0: event.offsetX, r0: event.offsetY, width: this._optionsZ.lineIsleWidth };
        break;
      }
      case Handler.Oscil: {
        let c = event.offsetX;
        let r = event.offsetY;
        if (this.sea.water[r][c].free) {
          this._sea2DOperationsService.addOscillator(r, c, this.options.OMEGA, 1);
        }
        this.draw();
        break;
      }
      case Handler.Rect: {
        this.o = { type: "rect", c0: event.offsetX, r0: event.offsetY, w: 0, h: 0 };
        break;
      }
      case Handler.Meter: {
        this.o = { c0: event.offsetX, r0: event.offsetY, w: 0, h: 0 };
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
          this._sea2DOperationsService.getRocksFromCanvasData(canvasData);
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
          this._sea2DOperationsService.getRocksFromCanvasData(canvasData);
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
        if (this.o) {
          this.energy = this._sea2DOperationsService.energyDensity(this.o);

          let ctx = this.context1d;
          ctx.clearRect(0, 0, this.options.N, this.options.N);
          this.o = null;
        }
        break;
      }
      default:
        break;
    }
    this.seaChanges.emit(this.sea);
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
        if (this.o) {
          this.o.w = event.offsetX - this.o.c0;
          this.o.h = event.offsetY - this.o.r0;

          let ctx = this.context1d;
          ctx.fillStyle = "gray";
          ctx.clearRect(0, 0, this.options.N, this.options.N);
          ctx.fillRect(this.o.c0, this.o.r0, this.o.w, this.o.h);
        }
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
    this._sea2DOperationsService.initSea(this.options);
  }

  private _stop(): void {
    clearInterval(this.timerId);
    this.timerId = null;
    this.playPauseIcon = 'play_arrow';
  }

  private _draw3D(): void {
    this._seaDrawService.draw3D(this.sea, this.options, this._optionsZ, this.display3DParams);
  }

  private _init3DSea(): void {
    this._sea3DOperationsService.init3DSea(this.options, this.display3DParams, this.canvas3d)

    this._optionsZ.cameraZ = this.options.N * Math.cos(this._settings3D.cameraRange);
    this._optionsZ.lightX = this._settings3D.lightRange * this.options.N / 2;
  }

  private _addIsle3D(isle): void {
    const mesh = this._sea3DOperationsService.getIsleMeshToAdd(isle, this.options);
    this.display3DParams.scene.add(mesh);
  }
}
