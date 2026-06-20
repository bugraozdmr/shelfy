const prisma = require('../config/prisma');
const baseMediaService = require('./baseMediaService');

class MovieService {
  async createMovie(data, file) {
    const { 
      title, original_title, status, genres, release_year,
      description, language, user_rating, is_favorite,
      ...specificFields 
    } = data;
    
    const parsedGenres = baseMediaService.parseGenres(genres);

    return prisma.$transaction(async (tx) => {
      // 1. Create base media entry with genres and movie specific data
      const baseEntry = await tx.mediaListEntry.create({
        data: {
          title, 
          original_title, 
          status: status ? status.toUpperCase() : 'PLAN_TO_WATCH',
          release_year: release_year ? parseInt(release_year, 10) : null,
          cover_image_path: file ? file.path : null,
          description, 
          language,
          user_rating: user_rating ? parseFloat(user_rating) : null,
          is_favorite: is_favorite === 'true' || is_favorite === true,
          type: 'MOVIE',
          genres: baseMediaService.buildGenreConnectOrCreate(parsedGenres),
          movie: {
            create: {
              duration_minutes: specificFields.duration_minutes ? parseInt(specificFields.duration_minutes, 10) : null,
              stopped_at_minute: specificFields.stopped_at_minute ? parseInt(specificFields.stopped_at_minute, 10) : 0,
              is_watched: specificFields.is_watched === 'true' || specificFields.is_watched === true,
              director: specificFields.director || null
            }
          }
        },
        include: {
          genres: true,
          movie: true
        }
      });

      return baseMediaService.flattenMedia(baseEntry);
    });
  }

  async updateMovie(id, data, file) {
    const { 
      title, original_title, status, genres, release_year,
      description, language, user_rating, is_favorite,
      ...specificFields 
    } = data;
    
    let parsedGenres = null;
    if (genres !== undefined) {
      parsedGenres = baseMediaService.parseGenres(genres);
    }

    return prisma.$transaction(async (tx) => {
      // 1. Prepare base data update
      const baseData = {};
      if (title !== undefined) baseData.title = title;
      if (original_title !== undefined) baseData.original_title = original_title;
      if (status !== undefined) baseData.status = status.toUpperCase();
      if (release_year !== undefined) baseData.release_year = release_year ? parseInt(release_year, 10) : null;
      if (description !== undefined) baseData.description = description;
      if (language !== undefined) baseData.language = language;
      if (user_rating !== undefined) baseData.user_rating = user_rating ? parseFloat(user_rating) : null;
      if (is_favorite !== undefined) baseData.is_favorite = is_favorite === 'true' || is_favorite === true;
      if (file) baseData.cover_image_path = file.path;
      if (parsedGenres !== null) baseData.genres = baseMediaService.buildGenreSetAndConnectOrCreate(parsedGenres);

      // 2. Prepare movie specific data update
      const movieData = {};
      if (specificFields.duration_minutes !== undefined) movieData.duration_minutes = specificFields.duration_minutes ? parseInt(specificFields.duration_minutes, 10) : null;
      if (specificFields.stopped_at_minute !== undefined) movieData.stopped_at_minute = parseInt(specificFields.stopped_at_minute, 10) || 0;
      if (specificFields.is_watched !== undefined) movieData.is_watched = specificFields.is_watched === 'true' || specificFields.is_watched === true;
      if (specificFields.director !== undefined) movieData.director = specificFields.director;

      if (Object.keys(movieData).length > 0) {
        baseData.movie = {
          update: movieData
        };
      }

      // Execute single update using Prisma's nested writes
      const baseEntry = await tx.mediaListEntry.update({
        where: { id },
        data: baseData,
        include: {
          genres: true,
          movie: true
        }
      });

      return baseMediaService.flattenMedia(baseEntry);
    });
  }
}

module.exports = new MovieService();
