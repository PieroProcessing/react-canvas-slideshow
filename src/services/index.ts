import * as assets from '../assets/images';

const list = () => Object.values(assets);
const imgList = list();
const getImage = async (index: number): Promise<HTMLImageElement> => new Promise((resolve) => {
    const IMG = new Image();
    IMG.src = imgList[index];
    IMG.onload = () => {
        resolve(IMG)
    }
})
export const simulatedApi = async () => {
    const promiseAll = await Promise.allSettled<Promise<HTMLImageElement>[]>(imgList.map((src, i) => getImage(i)))
    return promiseAll
        .reduce<HTMLImageElement[]>((acc, res) =>
            res.status === 'fulfilled'
                ? acc.concat(res.value)
                : acc
            , [])
}