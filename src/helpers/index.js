export const debounce = (func, ms) => {
    let timer;

    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, ms);
    };
};

export const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

export const generateID = () => {
    const date = new Date();
    return date.getTime();
};
