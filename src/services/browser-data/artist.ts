import browserDataGenre from './genre';

export default Array.from(Array(1000)).map((val, index) => ({
    id: index + 1,
    name: 'Artista #' + index,
    genreId: index % 2 === 0 ? null : browserDataGenre[Math.floor((Math.random() * browserDataGenre.length))].id,
}));
