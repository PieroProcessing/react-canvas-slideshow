import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import * as images from './assets/images';
import './assets/scss/index.scss';

export const App = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const onRefCanvas = useCallback((node: HTMLCanvasElement) => setCanvas(node), [])
  const simulatedApi = () => Object.values(images);

  useEffect(() => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const imagesSrcList = simulatedApi();
    const images = imagesSrcList.map(src => {
      const IMG = new Image();
      IMG.src = src;
      return IMG
    });

    ctx && (ctx.fillStyle = "rgb(242, 242, 242)");
    ctx?.fillRect(0, 0, canvas.width, canvas.height);
    renderCanvas(images, 1, canvas, -200, ctx);
    renderCanvas(images, 2, canvas, canvas.width * 1 - 200, ctx);


  }, [canvas]);

  const onCursor = useCallback((type: 'grab' | 'active'): MouseEventHandler<HTMLCanvasElement> => (event) => {
    if (!canvas) return;
    const el = (event.target as HTMLCanvasElement);
    const hasActiveClass =  el.classList.contains(type)
    hasActiveClass 
      ? (event.target as HTMLCanvasElement)?.classList.remove(type) 
      : (event.target as HTMLCanvasElement)?.classList.add(type);
  }, [canvas])
  const onDrag: MouseEventHandler<HTMLCanvasElement> = useCallback((event)=>{
    
  },[])
  return (
    <div className="slideshow">
      <header className="slideshow-header">
        <h1> Frontend Code Challenge</h1>
      </header>
      <main className="example">
        <canvas
          ref={onRefCanvas}
          className="image_slider"
          width={640}
          height={480}
          onMouseMove={onDrag}
          onMouseEnter={onCursor('active')}
          onMouseLeave={onCursor('active')}
          onMouseDown={onCursor('grab')}
          onMouseUp={onCursor('grab')}
        ></canvas>
        <aside>Drag to change image</aside>
      </main>

    </div>
  );
}

export default App;

const scaleForImage = (image: HTMLImageElement, canvas: HTMLCanvasElement) => {
  const aspect = canvas.width / canvas.height;
  const ratio = image.width / image.height;
  return ratio >= aspect
    ? canvas.width / image.width
    : aspect > ratio
      ? canvas.height / image.height
      : canvas.width

}


const indecesForOffset = (offset: number, numImg: number, sceneWidth: number) => {
  return [Math.floor(offset / sceneWidth * numImg), Math.ceil(offset / sceneWidth * numImg)]
};

function renderCanvas(images: HTMLImageElement[], index: number, canvas: HTMLCanvasElement, offset: number, ctx: CanvasRenderingContext2D | null) {
  const width = images[index].width * scaleForImage(images[index], canvas);
  const height = images[index].height * scaleForImage(images[index], canvas);
  const x = offset + (canvas.width - width) / 2;
  const y = (canvas.height - height) / 2;

  ctx?.drawImage(images[index], Math.round(x), Math.round(y), Math.round(width), Math.round(height));
}
