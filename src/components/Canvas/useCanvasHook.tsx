import { MouseEventHandler, useCallback, useEffect, useState, useRef } from "react";
import { simulatedApi } from "../../services";
import { drawCanvas, getMousePositionOnCanvas, updateOffset } from "../../utils";

export const useCanvasHook = () => {
    const [images, setImages] = useState<HTMLImageElement[]>();
    const [canvas, setCanvas] = useState<HTMLCanvasElement>();
    const isGrabbing = useRef<boolean>(false);
    const mousePostion = useRef({
        prevPosition: 0,
        actual: 0
    })

    const onRefCanvas = useCallback((node: HTMLCanvasElement) => setCanvas(node), [])

    useEffect(() => {
        simulatedApi()
            .then(setImages)
            .catch(console.error)
    }, [])
    useEffect(() => {
        if (!canvas || !images?.length) return;
        drawCanvas(canvas, mousePostion.current.actual, images);
    }, [canvas, images]);


    const onDrag: MouseEventHandler<HTMLCanvasElement> = useCallback((event) => {

        if (!canvas || !images?.length) return
        if (!isGrabbing.current) return;

        const actualMousePosition = getMousePositionOnCanvas(canvas, event);
        const updateActualPositionWith = updateOffset(canvas, mousePostion, images);
        mousePostion.current.actual = updateActualPositionWith(actualMousePosition);
        
        drawCanvas(canvas, mousePostion.current.actual, images);
        mousePostion.current.prevPosition = actualMousePosition;

    }, [canvas, images]);

    const onCursor = useCallback((type: 'grab' | 'active', action?: 'up' | 'down'): MouseEventHandler<HTMLCanvasElement> =>
        (event) => {
            if (!canvas) return;
            const el = (event.target as HTMLCanvasElement);
            const hasActiveClass = el.classList.contains(type)
            hasActiveClass
                ? (event.target as HTMLCanvasElement)?.classList.remove(type)
                : (event.target as HTMLCanvasElement)?.classList.add(type);

            isGrabbing.current = type === 'grab' && action === 'down';
            !isGrabbing.current
                && el.classList.contains('grab')
                && (event.target as HTMLCanvasElement)?.classList.remove('grab');

            isGrabbing.current
                ? (mousePostion.current.prevPosition = getMousePositionOnCanvas(canvas, event))
                : (mousePostion.current.prevPosition = 0)

        }, [canvas]);

    return {
        onRefCanvas, onDrag, onCursor
    }
}




