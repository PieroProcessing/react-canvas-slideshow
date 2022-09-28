import { useCanvasHook } from "./useCanvasHook";

export const Canvas = () => {
    const {onRefCanvas, onDrag, onCursor} = useCanvasHook();
  return (
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
  )
}
