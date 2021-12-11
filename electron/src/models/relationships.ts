import { Artist } from "./artist";
import { Database } from "./database";
import { Genre } from "./genre";

export const run = () => {
  // Relationships
  Artist.belongsTo(Genre, { foreignKey: 'genreId', as: 'genre' });
  Genre.hasMany(Artist, { as: 'artists' });

  //
  Database.sync({ alter: true });
}
