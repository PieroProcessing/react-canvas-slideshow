import { MouseEventHandler, useCallback, useEffect, useState, MouseEvent, useRef } from "react";
import * as list from './assets/images';
import './assets/scss/index.scss';

const simulatedApi = () => Object.values(list);
const imagesSrcList = simulatedApi();
const simulatedSelector = () => imagesSrcList.map(src => {
  const IMG = new Image();
  IMG.src = src;
  return IMG
})
const images = simulatedSelector();

export const App = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const isGrabbing = useRef<boolean>(false);
  const prevPosion = useRef<number>(0);
  const position = useRef<number>(0);

  const onRefCanvas = useCallback((node: HTMLCanvasElement) => setCanvas(node), [])

  useEffect(() => {
    if (!canvas) return;
    renderCanvas(canvas, position.current);
  }, [canvas]);

  const onCursor = useCallback((type: 'grab' | 'active', action?: 'up' | 'down'): MouseEventHandler<HTMLCanvasElement> =>
    (event) => {
      if (!canvas) return;
      const el = (event.target as HTMLCanvasElement);
      const hasActiveClass = el.classList.contains(type)
      hasActiveClass
        ? (event.target as HTMLCanvasElement)?.classList.remove(type)
        : (event.target as HTMLCanvasElement)?.classList.add(type);
      isGrabbing.current = type === 'grab' && action === 'down';

      type === 'grab' && action === 'down'
        ? (prevPosion.current = getMousePositionOnCanvas(canvas, event).x)
        : (prevPosion.current = 0)

    }, [canvas]);
  const onDrag: MouseEventHandler<HTMLCanvasElement> = useCallback((event) => {

    if (!canvas) return
    if (!isGrabbing.current) return;
    const { x } = getMousePositionOnCanvas(canvas, event);

    position.current = position.current + (prevPosion.current - x);
    console.log("🚀 ~ file: App.tsx ~ line 49 ~ constonDrag:MouseEventHandler<HTMLCanvasElement>=useCallback ~ position.current", position.current)

    const sceneWidth = canvas.width * images.length;

    const offset = position.current > 0 && position.current < sceneWidth - canvas.width
      ? position.current
      : position.current < 0
        ? 0
        : position.current > sceneWidth - canvas.width
          ? sceneWidth - canvas.width
          : 0

    renderCanvas(canvas, offset);
    prevPosion.current = x;


  }, [canvas]);
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
          onMouseDown={onCursor('grab', 'down')}
          onMouseUp={onCursor('grab', 'up')}
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
    : canvas.height / image.height


}


const indecesForOffset = (offset: number, numImg: number, sceneWidth: number) => {
  return [Math.floor(offset / sceneWidth * numImg), Math.ceil(offset / sceneWidth * numImg)]
};

const getMousePositionOnCanvas = (canvas: HTMLCanvasElement, event: MouseEvent) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function renderCanvas(canvas: HTMLCanvasElement, offset: number) {

  const ctx = canvas.getContext('2d');
  ctx && (ctx.fillStyle = "rgb(242, 242, 242)");
  ctx?.fillRect(0, 0, canvas.width, canvas.height);

  const indeces = indecesForOffset(offset, images.length, images.length * canvas.width);
  console.log("🚀 ~ file: App.tsx ~ line 112 ~ renderCanvas ~ indeces", indeces)

  indeces.forEach(index => {
    const width = images[index].width * scaleForImage(images[index], canvas);
    const height = images[index].height * scaleForImage(images[index], canvas);
    const x = (canvas.width * index - offset) + (canvas.width - width) / 2;
    const y = (canvas.height - height) / 2;
    ctx?.drawImage(images[index], Math.round(x), Math.round(y), Math.round(width), Math.round(height))
  })
}

