import { MouseEvent } from "react";

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
export const renderCanvas = (images: HTMLImageElement[], canvas: HTMLCanvasElement, offset: number) => {
    const ctx = canvas.getContext('2d');
    ctx && (ctx.fillStyle = "rgb(242, 242, 242)");
    ctx?.fillRect(0, 0, canvas.width, canvas.height);

    const indeces = indecesForOffset(offset, images.length, images.length * canvas.width);

    indeces.forEach(index => {
        const width = images[index].width * scaleForImage(images[index], canvas);
        const height = images[index].height * scaleForImage(images[index], canvas);
        const x = (canvas.width * index - offset) + (canvas.width - width) / 2;
        const y = (canvas.height - height) / 2;
        ctx?.drawImage(images[index], Math.round(x), Math.round(y), Math.round(width), Math.round(height))
    })
};

