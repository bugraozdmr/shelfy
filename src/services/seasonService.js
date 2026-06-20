const prisma = require('../config/prisma');

class SeasonService {
  async getSeasonsBySeriesId(seriesId) {
    return prisma.season.findMany({
      where: { series_id: seriesId },
      orderBy: { season_number: 'asc' },
      include: {
        episodes: {
          orderBy: { episode_number: 'asc' }
        }
      }
    });
  }

  async createSeason(data, file) {
    const { series_id, season_number, title, user_rating, default_episode_duration, release_year } = data;
    
    if (!series_id || season_number === undefined) {
      throw new Error('series_id and season_number are required');
    }

    // Verify the series exists
    const seriesExists = await prisma.series.findUnique({ where: { media_id: series_id } });
    if (!seriesExists) {
      throw new Error('Series not found');
    }

    const cover_image_path = file ? file.path : null;

    return prisma.season.create({
      data: {
        series_id,
        season_number: parseInt(season_number, 10),
        title: title || null,
        user_rating: user_rating ? parseFloat(user_rating) : null,
        default_episode_duration: default_episode_duration ? parseInt(default_episode_duration, 10) : null,
        release_year: release_year ? parseInt(release_year, 10) : null,
        cover_image_path
      },
      include: {
        episodes: true
      }
    });
  }

  async updateSeason(id, data, file) {
    const { title, user_rating, default_episode_duration, season_number, release_year } = data;
    
    const updateData = {};
    if (season_number !== undefined) updateData.season_number = parseInt(season_number, 10);
    if (title !== undefined) updateData.title = title;
    if (user_rating !== undefined) updateData.user_rating = user_rating ? parseFloat(user_rating) : null;
    if (default_episode_duration !== undefined) updateData.default_episode_duration = default_episode_duration ? parseInt(default_episode_duration, 10) : null;
    if (release_year !== undefined) updateData.release_year = release_year ? parseInt(release_year, 10) : null;
    if (file) updateData.cover_image_path = file.path;

    return prisma.season.update({
      where: { id },
      data: updateData,
      include: {
        episodes: true
      }
    });
  }

  async deleteSeason(id) {
    return prisma.season.delete({
      where: { id }
    });
  }
}

module.exports = new SeasonService();
