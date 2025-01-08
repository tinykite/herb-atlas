export const stringToTitlecase = (string: string) => {
    return string
        .toLowerCase()
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' ');
};

export const svgStringToImageSrc = (svgString) => {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
};