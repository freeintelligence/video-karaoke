export const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

export default Array.from(Array(rand(10, 30))).map((val, index) => ({
    name: 'Canción #' + index,
    mountpoint: null,
    path: 'C:/',
    genreName: 'Género #' + rand(0, 10000),
    artistName: 'Artista #' + rand(0, 10000),
    durationInSeconds: rand(60, 300),
    type: <'video'|'image'>(rand(0, 1) ? 'video' : 'image'),
    additional: {},
}));
