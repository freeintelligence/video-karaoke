import browserDataArtist from './artist';

export default Array.from(Array(5000)).map((val, index) => {
    const artistId = index % 2 === 0 ? null : browserDataArtist[Math.floor((Math.random() * browserDataArtist.length))].id;

    return ({
        id: index + 1,
        name: 'Canción #' + index,
        artistId,
        artistName: artistId ? 'Artista #' + artistId : null,
    });
});
