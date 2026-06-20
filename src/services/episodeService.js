const prisma = require('../config/prisma');

class EpisodeService {
  async getEpisodesBySeasonId(seasonId) {
    return prisma.episode.findMany({
      where: { season_id: seasonId },
      orderBy: { episode_number: 'asc' }
    });
  }

  async createEpisode(data) {
    const { season_id, episode_number, title, duration_minutes, status, user_notes } = data;
    
    if (!season_id || episode_number === undefined) {
      throw new Error('season_id and episode_number are required');
    }

    // Verify the season exists
    const seasonExists = await prisma.season.findUnique({ where: { id: season_id } });
    if (!seasonExists) {
      throw new Error('Season not found');
    }

    return prisma.episode.create({
      data: {
        season_id,
        episode_number: parseInt(episode_number, 10),
        title: title || null,
        duration_minutes: duration_minutes ? parseInt(duration_minutes, 10) : null,
        status: status ? status.toUpperCase() : 'PLAN_TO_WATCH',
        user_notes: user_notes || null
      }
    });
  }

  async updateEpisode(id, data) {
    const { episode_number, title, duration_minutes, status, user_notes } = data;
    
    const updateData = {};
    if (episode_number !== undefined) updateData.episode_number = parseInt(episode_number, 10);
    if (title !== undefined) updateData.title = title || null;
    if (duration_minutes !== undefined) updateData.duration_minutes = duration_minutes ? parseInt(duration_minutes, 10) : null;
    if (status !== undefined) updateData.status = status.toUpperCase();
    if (user_notes !== undefined) updateData.user_notes = user_notes || null;

    return prisma.episode.update({
      where: { id },
      data: updateData
    });
  }

  async deleteEpisode(id) {
    return prisma.episode.delete({
      where: { id }
    });
  }
}

module.exports = new EpisodeService();
