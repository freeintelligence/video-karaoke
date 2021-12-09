import { ArtistEvents } from './artist-events';
import { ConfigSettings } from './config-settings';
import { GenreEvents } from './genre-events';
import { MediaEvents } from './media-events';

export async function mainEvents() {

  const configSettings = new ConfigSettings();
  const mediaEvents = new MediaEvents();
  const artistEvents = new ArtistEvents();
  const genreEvents = new GenreEvents();

}
