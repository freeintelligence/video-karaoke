import { Artist } from "./artist";
import { Database } from "./database";
import { Genre } from "./genre";
import { Media } from "./media";

export const run = async () => {
  // Relationships
  Genre.hasMany(Artist, { as: 'artists' });
  Artist.belongsTo(Genre, { foreignKey: { field: 'genreId', allowNull: true, defaultValue: null }, as: 'genre' });
  Artist.hasMany(Media, { as: 'medias' });
  Media.belongsTo(Artist, { foreignKey: { field: 'artistId', allowNull: true, defaultValue: null }, as: 'artist' });

  //
  await Database.sync();
}
