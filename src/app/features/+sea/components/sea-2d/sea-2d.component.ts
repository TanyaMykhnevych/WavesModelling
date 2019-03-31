import { Component, ViewChild, ElementRef, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { Sea2DOperationsService } from '../../services/sea-2d-operations.service';
import { IOptions } from '../../models/options';
import { DEFAULT_SEA_2D_OPTIONS, DEFAULT_3D_SETTINGS, DEFAULT_SEA_3D_OPTIONS } from '../../constants/sea.constant';
import { ISea2D } from '../../models/sea';
import { SeaDrawService } from '../../services/sea-draw.service';
import { Handler } from '../../models/handlers.enum';
import { IOptions3D } from '../../models/options3D';
import { ISettings3D } from '../../models/settings3D';
import { Sea3DOperationsService } from '../../services/sea-3d-operations.service';
import { IDisplay3DParameters } from '../../models/display-3d-parameters';
import { IIsle } from '../../models/isle';
import { IsleType } from '../../models/isle-type.enum';

@Component({
  selector: 'app-sea-2d',
  templateUrl: './sea-2d.component.html',
  styleUrls: ['./sea-2d.component.css']
})
export class Sea2DComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas1d') canvas1d: ElementRef;
  @ViewChild('canvas2d') canvas2d: ElementRef;
  @ViewChild('canvas3d') canvas3d: ElementRef;

  public context: CanvasRenderingContext2D;
  public canvasData: ImageData;
  @Input() public set sea(sea: ISea2D) {
    this._sea = sea;
    this._sea2DOperationsService.sea = this._sea;
    if (this._sea.id) {
      this.redrawSea();
    }
  }

  public get sea(): ISea2D {
    return this._sea;
  }

  public o: IIsle;
  public timerId;
  public playPauseIcon: string = 'play_arrow';
  public _handler: Handler;
  public display3DParams: IDisplay3DParameters = {};
  public energy: number;

  private _settings3D: ISettings3D = DEFAULT_3D_SETTINGS;
  private _options: IOptions = DEFAULT_SEA_2D_OPTIONS;
  private _optionsZ: IOptions3D = DEFAULT_SEA_3D_OPTIONS;
  private _sea: ISea2D;

  public constructor(
    private _sea2DOperationsService: Sea2DOperationsService,
    private _seaDrawService: SeaDrawService,
    private _sea3DOperationsService: Sea3DOperationsService,
  ) { }

  public ngOnInit(): void {
    if (!this.sea.id) {
      this._initSea();
      this._init3DSea();
    }
  }

  @Input() public set options(options: IOptions) {
    Object.assign(this._options, options);
    this.redrawSea();
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
    this.canvasData = this.context2d.getImageData(0, 0, this.options.n, this.options.n);
    this.redrawSea();
    //this._draw3D();
  }

  public ngOnDestroy(): void {
    this._stop();
  }

  public clear(): void {
    this._sea2DOperationsService.clearSea();
    this._stop()
    this.redrawSea();
  }

  public redrawSea(): void {
    this._initSea();
    this._init3DSea();
    this.context2d.clearRect(0, 0, this.options.n, this.options.n);
    this.canvasData = this.context2d.getImageData(0, 0, this.options.n, this.options.n);
    this.draw();
    this._draw3D();

    this._sea.isles.forEach(i => {
      if (i.type === IsleType.Line) {
        this._handler = Handler.Line;
        this.onMouseDown({ offsetX: i.column, offsetY: i.row } as MouseEvent);
        this.onMouseMove({ offsetX: i.columnTo, offsetY: i.rowTo } as MouseEvent);
        this.onMouseUp(null);
      } else if (i.type === IsleType.Rectangle) {
        this._handler = Handler.Rect;
        this.onMouseDown({ offsetX: i.column, offsetY: i.row } as MouseEvent);
        this.onMouseMove({ offsetX: i.column + i.width, offsetY: i.row + i.height } as MouseEvent);
        this.onMouseUp(null);
      }
    });

    this.handler = Handler.Oscil;
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
        this.o = { type: IsleType.Line, column: event.offsetX, row: event.offsetY, width: this._optionsZ.lineIsleWidth };
        break;
      }
      case Handler.Oscil: {
        let c = event.offsetX;
        let r = event.offsetY;
        if (this.sea.water[r][c].free) {
          this._sea2DOperationsService.addOscillator(r, c, this.options.omega, 1);
        }
        this.draw();
        break;
      }
      case Handler.Rect: {
        this.o = { type: IsleType.Rectangle, column: event.offsetX, row: event.offsetY, width: 0, height: 0 };
        break;
      }
      case Handler.Meter: {
        this.o = { column: event.offsetX, row: event.offsetY, width: 0, height: 0 };
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
          if (isle.columnTo < isle.column) {
            [isle.columnTo, isle.column] = [isle.column, isle.columnTo];
            [isle.rowTo, isle.row] = [isle.row, isle.rowTo];
          }
          let canvasData = this.context1d.getImageData(0, 0, this.options.n, this.options.n);
          this._sea2DOperationsService.getRocksFromCanvasData(canvasData);

          const theSameIsle = this.sea.isles.filter(i => i.column === this.o.column && i.row === this.o.row
            && i.columnTo === this.o.columnTo && i.rowTo === this.o.rowTo);
          if (!theSameIsle.length) {
            this.sea.isles.push(this.o);
          }

          this.draw();
          this._addIsle3D(isle);
          this._draw3D();
          let ctx = this.context1d;
          ctx.clearRect(0, 0, this.options.n, this.options.n);
          this.o = null;
        }
        break;
      }
      case Handler.Rect: {
        if (this.o) {
          let canvasData = this.context1d.getImageData(0, 0, this.options.n, this.options.n);
          this._sea2DOperationsService.getRocksFromCanvasData(canvasData);

          const theSameIsle = this.sea.isles.filter(i => i.column === this.o.column && i.row === this.o.row
            && i.height === this.o.height && i.width === this.o.width);
          if (!theSameIsle.length) {
            this.sea.isles.push(this.o);
          }

          this.draw();
          this._addIsle3D(this.o);
          this._draw3D();
          let ctx = this.context1d;
          ctx.clearRect(0, 0, this.options.n, this.options.n);
          this.o = null;
        }
        break;
      }
      case Handler.Meter: {
        if (this.o) {
          this.energy = this._sea2DOperationsService.energyDensity(this.o);

          let ctx = this.context1d;
          ctx.clearRect(0, 0, this.options.n, this.options.n);
          this.o = null;
        }
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
          this.o.columnTo = event.offsetX;
          this.o.rowTo = event.offsetY;

          this.context = this.context1d;
          this.context.strokeStyle = "white";
          this.context.clearRect(0, 0, this.options.n, this.options.n);

          this.context.lineWidth = this.o.width;
          this.context.beginPath();
          this.context.moveTo(this.o.column, this.o.row);
          this.context.lineTo(this.o.columnTo, this.o.rowTo);
          this.context.stroke();
        }
        break;
      }
      case Handler.Rect: {
        if (this.o) {
          this.o.width = event.offsetX - this.o.column;
          this.o.height = event.offsetY - this.o.row;

          let ctx = this.context1d;
          ctx.fillStyle = "lightblue";
          ctx.clearRect(0, 0, this.options.n, this.options.n);
          ctx.fillRect(this.o.column, this.o.row, this.o.width, this.o.height);
        }
        break;
      }
      case Handler.Meter: {
        if (this.o) {
          this.o.width = event.offsetX - this.o.column;
          this.o.height = event.offsetY - this.o.row;

          let ctx = this.context1d;
          ctx.fillStyle = "gray";
          ctx.clearRect(0, 0, this.options.n, this.options.n);
          ctx.fillRect(this.o.column, this.o.row, this.o.width, this.o.height);
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
    this._optionsZ.cameraY = this.options.n * Math.sin(settings.cameraRange);
    this._optionsZ.cameraZ = this.options.n * Math.cos(settings.cameraRange);
    this._optionsZ.lightX = settings.lightRange * this.options.n / 2;
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

    this._optionsZ.cameraZ = this.options.n * Math.cos(this._settings3D.cameraRange);
    this._optionsZ.lightX = this._settings3D.lightRange * this.options.n / 2;
  }

  private _addIsle3D(isle): void {
    const mesh = this._sea3DOperationsService.getIsleMeshToAdd(isle, this.options);
    this.display3DParams.scene.add(mesh);
  }
}
