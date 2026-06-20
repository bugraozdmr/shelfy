const prisma = require('../config/prisma');
const baseMediaService = require('./baseMediaService');

class PrintMediaService {
  async createPrintMedia(data, file) {
    const { 
      title, original_title, status, genres, release_year,
      description, language, user_rating, is_favorite,
      ...specificFields 
    } = data;
    
    const parsedGenres = baseMediaService.parseGenres(genres);

    return prisma.$transaction(async (tx) => {
      // 1. Create base media entry with genres and print specific data
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
          type: 'PRINT',
          genres: baseMediaService.buildGenreConnectOrCreate(parsedGenres),
          print_media: {
            create: {
              author: specificFields.author || null,
              total_pages_or_chapters: specificFields.total_pages_or_chapters ? parseInt(specificFields.total_pages_or_chapters, 10) : null,
              current_progress: specificFields.current_progress ? parseInt(specificFields.current_progress, 10) : 0,
              print_type: specificFields.print_type || null
            }
          }
        },
        include: {
          genres: true,
          print_media: true
        }
      });

      return baseMediaService.flattenMedia(baseEntry);
    });
  }

  async updatePrintMedia(id, data, file) {
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

      // 2. Prepare print specific data update
      const printData = {};
      if (specificFields.author !== undefined) printData.author = specificFields.author;
      if (specificFields.total_pages_or_chapters !== undefined) printData.total_pages_or_chapters = specificFields.total_pages_or_chapters ? parseInt(specificFields.total_pages_or_chapters, 10) : null;
      if (specificFields.current_progress !== undefined) printData.current_progress = parseInt(specificFields.current_progress, 10) || 0;
      if (specificFields.print_type !== undefined) printData.print_type = specificFields.print_type;

      if (Object.keys(printData).length > 0) {
        baseData.print_media = {
          update: printData
        };
      }

      // Execute single update using Prisma's nested writes
      const baseEntry = await tx.mediaListEntry.update({
        where: { id },
        data: baseData,
        include: {
          genres: true,
          print_media: true
        }
      });

      return baseMediaService.flattenMedia(baseEntry);
    });
  }
}

module.exports = new PrintMediaService();
