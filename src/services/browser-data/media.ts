import browserDataArtist from './artist';

export default Array.from(Array(5000)).map((val, index) => {
    const artistId = index % 2 === 0 ? null : browserDataArtist[Math.floor((Math.random() * browserDataArtist.length))].id;

    return ({
        id: index + 1,
        name: 'Canción #' + index,
        artistId,
        artistName: artistId ? 'Artista #' + artistId : null,
        mediaUrl: '/assets/videos/media-test.mp4',
        durationInSeconds: Math.floor(Math.random() * (300 - 60 + 1) + 60),
    });
});
