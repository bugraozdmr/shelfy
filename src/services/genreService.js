const prisma = require('../config/prisma');

class GenreService {
  async getAllGenres() {
    return prisma.genre.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { medias: true }
        }
      }
    });
  }

  async createGenre(data) {
    const { name } = data;
    if (!name) {
      throw new Error('Genre name is required');
    }

    return prisma.genre.create({
      data: { name: name.trim() }
    });
  }

  async getGenreById(id) {
    const genre = await prisma.genre.findUnique({
      where: { id },
      include: {
        _count: {
          select: { medias: true }
        }
      }
    });

    if (!genre) {
      throw new Error('Genre not found');
    }
    return genre;
  }

  async updateGenre(id, data) {
    const { name } = data;
    if (!name) {
      throw new Error('Genre name is required');
    }

    return prisma.genre.update({
      where: { id },
      data: { name: name.trim() }
    });
  }

  async deleteGenre(id) {
    // Note: Implicit m:n relation deletes only the connection, not the media.
    // Deleting a genre will remove it from all media that use it.
    return prisma.genre.delete({
      where: { id }
    });
  }
}

module.exports = new GenreService();
