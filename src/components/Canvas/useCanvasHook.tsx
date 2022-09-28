import { MouseEventHandler, useCallback, useEffect, useState, useRef } from "react";
import { simulatedApi } from "../../services";
import { getMousePositionOnCanvas, indecesForOffset, scaleForImage, updateOffset } from "../../utils";

export const useCanvasHook = () => {
    const  [images, setImages] = useState<HTMLImageElement[]>();
    const [canvas, setCanvas] = useState<HTMLCanvasElement>();
    const isGrabbing = useRef<boolean>(false);
    const mousePostion = useRef({
        prevPosition: 0,
        actual: 0
    })

    const onRefCanvas = useCallback((node: HTMLCanvasElement) => setCanvas(node), [])

    const renderCanvas = useCallback(( offset: number) => {
        if(!canvas || !images?.length)return;
       
        const ctx = canvas.getContext('2d');
        ctx && (ctx.fillStyle = "rgb(242, 242, 242)");
        ctx?.fillRect(0, 0, canvas.width, canvas.height);

        const indeces = indecesForOffset(offset, images.length, images.length * canvas.width);

        const callback = (index: number, image: HTMLImageElement) => {
            const width = image.width * scaleForImage(image, canvas);
            const height = image.height * scaleForImage(image, canvas);
            const x = (canvas.width * index - offset) + (canvas.width - width) / 2;
            const y = (canvas.height - height) / 2;
            ctx?.drawImage(image, Math.round(x), Math.round(y), Math.round(width), Math.round(height),)
        }
        
        indeces.forEach( index => callback(index, images[index]))

    },[canvas, images]);
    
    useEffect(()=>{
        simulatedApi()
            .then(setImages)
            .catch(console.error)
    },[])
    useEffect(() => {
        renderCanvas(mousePostion.current.actual);
    }, [ renderCanvas]);
   

    const onDrag: MouseEventHandler<HTMLCanvasElement> = useCallback((event) => {

        if (!canvas || !images?.length) return
        if (!isGrabbing.current) return;


        const updatePosition = updateOffset(canvas, mousePostion, images )
        const { x } = getMousePositionOnCanvas(canvas, event);
        const offset = updatePosition(x);

        if (!offset) return;

        mousePostion.current.actual = offset;
        renderCanvas(mousePostion.current.actual);
        mousePostion.current.prevPosition = x;
   
    }, [canvas, images, renderCanvas]);

    const onCursor = useCallback((type: 'grab' | 'active', action?: 'up' | 'down'): MouseEventHandler<HTMLCanvasElement> =>
        (event) => {
            if (!canvas) return;
            const el = (event.target as HTMLCanvasElement);
            const hasActiveClass = el.classList.contains(type)
            hasActiveClass
                ? (event.target as HTMLCanvasElement)?.classList.remove(type)
                : (event.target as HTMLCanvasElement)?.classList.add(type);

            isGrabbing.current = type === 'grab' && action === 'down';

            isGrabbing.current
                ? (mousePostion.current.prevPosition = getMousePositionOnCanvas(canvas, event).x)
                : (mousePostion.current.prevPosition = 0)

        }, [canvas]);

    return {
        onRefCanvas, onDrag, onCursor
    }
}


