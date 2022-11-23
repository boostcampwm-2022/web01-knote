import { CreateArticle, CreateTemporaryArticle } from '@apis/article/article.interface';
import { prisma } from '@config/orm.config';

const createArticle = async (dto: CreateArticle) => {
  const { title, content, book_id } = dto;

  const article = await prisma.article.create({
    data: {
      title,
      content,
      book: {
        connect: {
          id: book_id,
        },
      },
    },
  });

  return article;
};

const createTemporaryArticle = async (dto: CreateTemporaryArticle) => {
  const { title, content, user_id } = dto;

  const temporaryArticle = await prisma.temporaryArticle.create({
    data: {
      title,
      content,
      user: {
        connect: {
          id: user_id,
        },
      },
    },
  });

  return temporaryArticle;
};

const findTemporaryArticle = async (userId: number) => {
  const temporaryArticle = await prisma.temporaryArticle.findFirst({
    where: {
      user_id: userId,
    },
    select: {
      title: true,
      content: true,
    },
  });

  return temporaryArticle;
};

export default {
  createArticle,
  createTemporaryArticle,
  findTemporaryArticle,
};