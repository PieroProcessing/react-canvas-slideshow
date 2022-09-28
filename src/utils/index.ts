import { MouseEvent, MutableRefObject } from "react";

export const scaleForImage = (image: HTMLImageElement, canvas: HTMLCanvasElement) => {
    const aspect = canvas.width / canvas.height;
    const ratio = image.width / image.height;
    return ratio >= aspect
        ? canvas.width / image.width
        : canvas.height / image.height
};

export const indecesForOffset = (offset: number, numImg: number, sceneWidth: number) => {
    return [Math.floor(offset / sceneWidth * numImg), Math.ceil(offset / sceneWidth * numImg)]
};

export const getMousePositionOnCanvas = (canvas: HTMLCanvasElement, event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
};
 
export const updateOffset = (
    canvas: HTMLCanvasElement,
    mousePostion: MutableRefObject<{prevPosition: number;actual: number;}>,
    images: HTMLImageElement[]) =>
    (x: number) => {
        const sceneWidth = canvas.width * images.length;

        const { prevPosition, actual } = mousePostion.current;
        const newPos = actual + (prevPosition - x);
        const offset = (newPos >= 0 && newPos <= sceneWidth - canvas.width && newPos)
            || (newPos < 0 && 0)
            || (newPos > sceneWidth - canvas.width && sceneWidth - canvas.width);
        return offset;
    }