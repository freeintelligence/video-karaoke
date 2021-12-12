export default Array.from(Array(100)).map((val, index) => Object({
    id: index + 1,
    name: 'Género #' + index,
}));
