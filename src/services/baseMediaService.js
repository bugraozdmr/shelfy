const prisma = require('../config/prisma');

class BaseMediaService {
  /**
   * Helper method to flatten Prisma's nested structure into a flat JSON object
   */
  flattenMedia(entry) {
    if (!entry) return null;
    
    // Destructure to separate nested relations
    const { movie, series, print_media, genres, ...baseData } = entry;
    
    // Flatten genres into an array of strings (names)
    const flattenedGenres = genres ? genres.map(g => g.name) : [];
    
    let specificData = {};
    if (entry.type === 'MOVIE' && movie) {
      specificData = movie;
    } else if (entry.type === 'SERIES' && series) {
      specificData = series;
    } else if (entry.type === 'PRINT' && print_media) {
      specificData = print_media;
    }

    return { 
      ...baseData, 
      ...specificData, 
      genres: flattenedGenres 
    };
  }

  /**
   * Helper to parse comma separated genres or arrays into string arrays
   */
  parseGenres(genres) {
    if (!genres) return [];
    if (typeof genres === 'string') {
      return genres.split(',').map(g => g.trim()).filter(Boolean);
    }
    if (Array.isArray(genres)) {
      return genres;
    }
    return [];
  }

  /**
   * Helper to build genre connection object for Prisma.
   */
  buildGenreConnectOrCreate(genresArray) {
    if (!genresArray || genresArray.length === 0) return undefined;
    return {
      connectOrCreate: genresArray.map(name => ({
        where: { name: name.trim() },
        create: { name: name.trim() }
      }))
    };
  }

  /**
   * Helper to build a complete replacement object for updates.
   */
  buildGenreSetAndConnectOrCreate(genresArray) {
    if (!genresArray) return undefined;
    if (genresArray.length === 0) return { set: [] };
    
    return {
      set: [], // Disconnect existing
      connectOrCreate: genresArray.map(name => ({
        where: { name: name.trim() },
        create: { name: name.trim() }
      }))
    };
  }

  /**
   * Advanced GET operations with Pagination, Filtering, and Sorting
   */
  async getAllMedia(query = {}) {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      status, 
      genre, 
      sortBy = 'updated_at', 
      order = 'desc',
      search,
      is_favorite
    } = query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build the where clause for filtering
    const where = {};
    
    if (type) {
      where.type = type.toUpperCase();
    }
    
    if (status) {
      where.status = status.toUpperCase();
    }
    
    if (is_favorite !== undefined) {
      where.is_favorite = is_favorite === 'true';
    }
    
    if (genre) {
      where.genres = {
        some: {
          name: {
            equals: genre,
            mode: 'insensitive'
          }
        }
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { original_title: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Determine the orderBy clause
    const orderBy = {};
    const validSortFields = ['updated_at', 'created_at', 'title', 'release_year', 'user_rating'];
    if (validSortFields.includes(sortBy)) {
      orderBy[sortBy] = order === 'asc' ? 'asc' : 'desc';
    } else {
      orderBy['updated_at'] = 'desc';
    }

    const [entries, total] = await Promise.all([
      prisma.mediaListEntry.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          movie: true,
          series: { include: { seasons: { include: { episodes: true } } } },
          print_media: true,
          genres: true
        }
      }),
      prisma.mediaListEntry.count({ where })
    ]);

    return {
      data: entries.map(entry => this.flattenMedia(entry)),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getMediaById(id) {
    const entry = await prisma.mediaListEntry.findUnique({
      where: { id },
      include: {
        movie: true,
        series: { include: { seasons: { include: { episodes: true } } } },
        print_media: true,
        genres: true
      }
    });

    if (!entry) {
      throw new Error('Media not found');
    }
    return this.flattenMedia(entry);
  }

  async deleteMedia(id) {
    const entry = await prisma.mediaListEntry.findUnique({ where: { id } });
    if (!entry) {
      throw new Error('Media not found');
    }
    return prisma.mediaListEntry.delete({
      where: { id }
    });
  }
}

module.exports = new BaseMediaService();
