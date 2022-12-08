import { colorStr2rgbaArr, genColorStrByColors } from '../../utils/color'
import { DEFAULT_CONFIG } from './consts'

interface IConfig {
  fillColor?: string
  fps?: number
}

class AudioWave {
  config: Required<IConfig>
  convas: HTMLCanvasElement
  audio: HTMLAudioElement
  ctx: {
    canvas: CanvasRenderingContext2D,
    audio?: AudioContext | null,
  }
  audioSource: MediaElementAudioSourceNode
  audioAnalyser: AnalyserNode
  size: { width: number, height: number}
  ratio = window.devicePixelRatio || 2
  baseY = 0
  running = false

  constructor(canvas: HTMLCanvasElement, audio: HTMLAudioElement, config: IConfig) {
    this.setConf(config)
    this.convas = canvas
    this.audio = audio
    this.ctx = {
      canvas: canvas.getContext('2d') as CanvasRenderingContext2D
    }
    this.size = {
      width: canvas.offsetWidth * this.ratio,
      height: canvas.offsetHeight * this.ratio,
    }
    this.initBaseY()
    this.init(canvas)
  }

  setConf(config: IConfig = {}) {
    const curConfig = this.config || {}
    this.config = {
      ...DEFAULT_CONFIG,
      ...curConfig,
      ...config
    }
  }

  initBaseY() {
    this.baseY = Math.floor(this.size.height * 4/5)
  }

  init(canvas: HTMLCanvasElement) {
    const { width, height } = this.size
    const { fillColor } = this.config

    canvas.width = width
    canvas.height = height

    this.ctx.canvas.beginPath();
    this.ctx.canvas.fillStyle = fillColor;
    this.ctx.canvas.moveTo(0, this.baseY);
    this.ctx.canvas.lineTo(width, this.baseY);
    this.ctx.canvas.lineTo(width, height);
    this.ctx.canvas.lineTo(0, height);
    this.ctx.canvas.fill();
  }

  initAudio() {
    this.ctx.audio = new window.AudioContext()

    this.audioSource = this.ctx.audio.createMediaElementSource(this.audio)
    this.audioAnalyser = this.ctx.audio.createAnalyser()
    this.audioAnalyser.connect(this.ctx.audio.destination)
    this.audioSource.connect(this.audioAnalyser)
  }

  draw(array){
    const { fillColor } = this.config

    const { width, height } = this.size
    const canvasCtx = this.ctx.canvas
    canvasCtx.clearRect(0, 0, width, height)
    //array的长度为1024, 总共取10个关键点,关键点左右边各取五个点作为过渡,波浪更为自然;
    let waveTemp: number[] = []
    let leftTemp: number[] = []
    let rightTemp: number[] = []

    //事先定好要取的点的key,相比下面直接循环整个数组来说效率高很多。
    let waveStepArr = [0, 51, 102, 153, 204, 255, 306, 357, 408];
    let leftStepArr = [70, 141, 212, 283, 354];
    let rightStepArr = [90, 181, 272, 363, 454];

    waveStepArr.map((key) => {
      waveTemp.push(array[key] / 2.6);
    });
    leftStepArr.map((key) => {
      leftTemp.unshift(Math.floor(array[key] / 4.8));
    });
    rightStepArr.map((key) => {
      rightTemp.push(Math.floor(array[key] / 4.8));
    });
    
    const waveArr1 = [leftTemp, waveTemp, rightTemp].flat().map(data => data * 1.8)
    const waveArr2 = [leftTemp, rightTemp].flat().map(data => data * 2.4)
    let waveWidth = Math.ceil(width / (waveArr1.length - 3));
    let waveWidth2 =  Math.ceil(width / (waveArr2.length - 3));

    canvasCtx.beginPath();
    canvasCtx.fillStyle = fillColor
    canvasCtx.moveTo(-waveWidth2, this.baseY - waveArr2[0]);

    for(let i = 1; i < waveArr2.length - 2; i ++) {
      let p0 = {x: (i - 1) * waveWidth2, y:waveArr2[i - 1]};
      let p1 = {x: (i) * waveWidth2, y:waveArr2[i]};
      let p2 = {x: (i + 1) * waveWidth2, y:waveArr2[i + 1]};
      let p3 = {x: (i + 2) * waveWidth2, y:waveArr2[i + 2]};

      for(let j = 0; j < 100; j ++) {
        let t = j * (1.0 / 100);
        let tt = t * t;
        let ttt = tt * t;
        let CGPoint = { x: 0, y: 0};
        CGPoint.x = 0.5 * (2*p1.x+(p2.x-p0.x)*t + (2*p0.x-5*p1.x+4*p2.x-p3.x)*tt + (3*p1.x-p0.x-3*p2.x+p3.x)*ttt);
        CGPoint.y = 0.5 * (2*p1.y+(p2.y-p0.y)*t + (2*p0.y-5*p1.y+4*p2.y-p3.y)*tt + (3*p1.y-p0.y-3*p2.y+p3.y)*ttt);
        canvasCtx.lineTo(CGPoint.x, this.baseY - CGPoint.y);
      }
      canvasCtx.lineTo(p2.x, this.baseY - p2.y);
    }

    canvasCtx.lineTo((waveArr2.length - 1) * waveWidth2, this.baseY - waveArr2[waveArr2.length - 1]);
    canvasCtx.lineTo(width + waveWidth2, this.baseY);
    canvasCtx.lineTo(width + waveWidth2, height);
    canvasCtx.lineTo(-1 * waveWidth2, height);
    canvasCtx.fill();

    canvasCtx.beginPath();
    canvasCtx.fillStyle = genColorStrByColors(colorStr2rgbaArr(fillColor), [0, 0, 0, 0.4])
    canvasCtx.moveTo(-waveWidth * 2, this.baseY - waveArr1[0]);
    for(let i = 1; i < waveArr1.length - 2; i++) {
        let p0 = {x: (i - 2) * waveWidth, y:waveArr1[i - 1]};
        let p1 = {x: (i - 1) * waveWidth, y:waveArr1[i]};
        let p2 = {x: (i) * waveWidth, y:waveArr1[i + 1]};
        let p3 = {x: (i + 1) * waveWidth, y:waveArr1[i + 2]};

        for(let j = 0; j < 100; j++) {
            let t = j * (1.0 / 100);
            let tt = t * t;
            let ttt = tt * t;
            let CGPoint = {x: 0, y: 0};
            CGPoint.x = 0.5 * (2*p1.x+(p2.x-p0.x)*t + (2*p0.x-5*p1.x+4*p2.x-p3.x)*tt + (3*p1.x-p0.x-3*p2.x+p3.x)*ttt);
            CGPoint.y = 0.5 * (2*p1.y+(p2.y-p0.y)*t + (2*p0.y-5*p1.y+4*p2.y-p3.y)*tt + (3*p1.y-p0.y-3*p2.y+p3.y)*ttt);
            canvasCtx.lineTo(CGPoint.x, this.baseY - CGPoint.y);
        }
        canvasCtx.lineTo(p2.x, this.baseY - p2.y);
    }
    canvasCtx.lineTo((waveArr1.length) * waveWidth, this.baseY - waveArr1[waveArr1.length - 1]);
    canvasCtx.lineTo(width + waveWidth * 2, this.baseY);
    canvasCtx.lineTo(width + waveWidth * 2, height);
    canvasCtx.lineTo(-2 * waveWidth, height);
    canvasCtx.fill();
  }

  timer: number
  prevRenterTs = Date.now()
  start() {
    if (!this.ctx.audio) {
      this.initAudio()
    }
    const { fps } = this.config
    const renderInterval = Math.floor(1000 / fps)
    this.initBaseY()
    this.running = true
    const fn = () => {
      let isStop = false
      if (!this.running) {
        isStop = this.baseY > this.size.height
        if (!isStop) {
          this.baseY += 24
        } else {
          cancelAnimationFrame(this.timer);
        }
      }
      if (Date.now() - this.prevRenterTs > renderInterval) {
        this.prevRenterTs = Date.now()
        const arr = new Uint8Array(this.audioAnalyser.frequencyBinCount)
        this.audioAnalyser.getByteFrequencyData(arr)
        this.draw(arr)
      }
      if (!isStop) {
        this.timer = requestAnimationFrame(fn)
      }
    }
    this.timer = requestAnimationFrame(fn);
  }
  stop() {
    this.running = false
  }
}

export { AudioWave }