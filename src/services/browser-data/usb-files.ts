const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

export default Array.from(Array(rand(1000, 2000))).map((val, index) => ({
    name: 'Canción #' + index,
    genreName: 'Género #' + rand(0, 10000),
    artistName: 'Artista #' + rand(0, 10000),
    path: 'C:/',
    durationInSeconds: rand(60, 300),
    additional: {},
}));
