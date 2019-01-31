import { Component, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { SeaOperationsService } from '../../services/sea-operations.service';
import { IOptions } from '../../models/options';
import { DEFAULT_SEA_OPTIONS, DEFAULT_SEA } from '../../constants/sea.constant';
import { ISea } from '../../models/sea';
import { SeaDrawService } from '../../services/sea-draw.service';
import { Handler } from '../../models/handlers.enum';

@Component({
  selector: 'app-sea',
  templateUrl: './sea.component.html',
  styleUrls: ['./sea.component.css']
})
export class SeaComponent implements AfterViewInit {
  @ViewChild('canvas2d') canvas2d: ElementRef;
  @ViewChild('canvas1d') canvas1d: ElementRef;
  public context: CanvasRenderingContext2D;
  public canvasData: ImageData;
  public sea: ISea = DEFAULT_SEA;
  public o: any;
  public handler: Handler = Handler.Oscil;
  public timerId;
  private _options: IOptions = DEFAULT_SEA_OPTIONS;

  public constructor(
    private _seaOperationsService: SeaOperationsService,
    private _seaDrawService: SeaDrawService,
  ) { }

  public ngOnInit(): void {
    this._initSea();
    this._seaOperationsService.sea = this.sea;
  }

  @Input() public set options(options: IOptions) {
    this._options = options;
    this.ngOnInit();
  }

  public get options() {
    return this._options;
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
  }

  public play(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    } else {
      this.timerId = setInterval(() => {
        this._seaOperationsService.step(this.options);
        this.draw();
      }, 50);
    }
  }

  public onMouseDown(event: MouseEvent): void {
    switch (this.handler) {
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
    switch (this.handler) {
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
    switch (this.handler) {
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

  private _initSea(): void {
    for (let r = 0; r < this.options.N; r++) {
      let row = [];
      for (let c = 0; c < this.options.N; c++) {
        row.push({ x: 0, f: 0, v: 0, free: 1 });
      }
      this.sea.water.push(row);
    }
    this.sea.point = { row: 0, column: 0 };
    this.sea.n = this.options.N;
  }
}
