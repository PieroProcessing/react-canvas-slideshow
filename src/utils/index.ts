import { MouseEvent, MutableRefObject } from "react";

const scaleForImage = (image: HTMLImageElement, canvas: HTMLCanvasElement) => {
    const aspect = canvas.width / canvas.height;
    const ratio = image.width / image.height;
    return ratio >= aspect
        ? canvas.width / image.width
        : canvas.height / image.height
};

const indecesForOffset = (offset: number, numImg: number, sceneWidth: number) => {
    return [Math.floor(offset / sceneWidth * numImg), Math.ceil(offset / sceneWidth * numImg)]
};

export const getMousePositionOnCanvas = (canvas: HTMLCanvasElement, event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    return  event.clientX - rect.left
};
 
export const updateOffset = (
    canvas: HTMLCanvasElement,
    mousePostion: MutableRefObject<{prevPosition: number;actual: number;}>,
    images: HTMLImageElement[]) =>
    (x: number) => {
        const sceneWidth = canvas.width * images.length;
        const { prevPosition, actual } = mousePostion.current;
        const newPos = actual + (prevPosition - x);
        const offset = Math.max(0, newPos) && Math.min(newPos, sceneWidth - canvas.width)
        return offset;
    }
export const drawCanvas = (canvas: HTMLCanvasElement, offset: number, images: HTMLImageElement[]) => {
    const ctx = canvas.getContext('2d');
    ctx && (ctx.fillStyle = "rgb(242, 242, 242)");
    ctx?.fillRect(0, 0, canvas.width, canvas.height);

    const indeces = indecesForOffset(offset, images.length, images.length * canvas.width);

    const callback = (index: number, image: HTMLImageElement) => {
        const width = image.width * scaleForImage(image, canvas);
        const height = image.height * scaleForImage(image, canvas);
        const x = (canvas.width * index - offset) + (canvas.width - width) / 2;
        const y = (canvas.height - height) / 2;
        ctx?.drawImage(image, Math.round(x), Math.round(y), Math.round(width), Math.round(height));
    };

    indeces.forEach(index => callback(index, images[index]));
}