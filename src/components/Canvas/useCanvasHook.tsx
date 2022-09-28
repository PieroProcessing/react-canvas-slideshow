import { MouseEventHandler, useCallback, useEffect, useState, useRef } from "react";
import { images } from "../../services";
import { getMousePositionOnCanvas, renderCanvas } from "../../utils";

export const useCanvasHook = () => {
    const [canvas, setCanvas] = useState<HTMLCanvasElement>();
    const isGrabbing = useRef<boolean>(false);
    // refactor //
    const prevPosion = useRef<number>(0);
    const position = useRef<number>(0);
    
    const onRefCanvas = useCallback((node: HTMLCanvasElement) => setCanvas(node), [])

    useEffect(() => {
        if (!canvas) return;
        renderCanvas(images, canvas, position.current);
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

        const sceneWidth = canvas.width * images.length;

        const offset = position.current > 0 && position.current < sceneWidth - canvas.width
            ? position.current
            : position.current < 0
                ? 0
                : position.current > sceneWidth - canvas.width
                    ? sceneWidth - canvas.width
                    : 0

        renderCanvas(images, canvas, offset);
        prevPosion.current = x;


    }, [canvas]);
  return {
      onRefCanvas, onDrag, onCursor
  }
}
