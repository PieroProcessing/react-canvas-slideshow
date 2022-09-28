import * as list from '../assets/images'; 

const simulatedApi = () => Object.values(list);
const imagesSrcList = simulatedApi();
const simulatedSelector = () => imagesSrcList.map(src => {
    const IMG = new Image();
    IMG.src = src;
    return IMG
})
export const images = simulatedSelector();