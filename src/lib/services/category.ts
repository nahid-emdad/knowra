import { prisma } from '@/lib/db';
import { CategoryCreateInput, CategoryUpdateInput, slugify } from '@/lib/validations';

export class CategoryService {
  /**
   * Creates a new knowledge category.
   */
  static async create(input: CategoryCreateInput) {
    const slug = input.slug ? slugify(input.slug) : slugify(input.name);

    return prisma.category.create({
      data: {
        name: input.name,
        slug,
        description: input.description,
        parentId: input.parentId ?? null,
      },
      include: {
        parent: true,
      },
    });
  }

  /**
   * Retrieves all categories, structured as a hierarchy (parents with children).
   */
  static async listTree() {
    return prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            _count: {
              select: { knowledgeItems: true },
            },
          },
        },
        _count: {
          select: { knowledgeItems: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Retrieves flat list of all categories.
   */
  static async listAll() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: { knowledgeItems: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Retrieves category by slug including parent and child categories.
   */
  static async getBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: true,
        _count: {
          select: { knowledgeItems: true },
        },
      },
    });
  }

  /**
   * Updates a category.
   */
  static async update(id: string, input: CategoryUpdateInput) {
    const data: Record<string, unknown> = {};

    if (input.name !== undefined) data.name = input.name;
    if (input.description !== undefined) data.description = input.description;
    if (input.parentId !== undefined) data.parentId = input.parentId;
    if (input.slug !== undefined) {
      data.slug = slugify(input.slug);
    } else if (input.name !== undefined) {
      data.slug = slugify(input.name);
    }

    return prisma.category.update({
      where: { id },
      data,
    });
  }

  /**
   * Deletes a category if it has no knowledge items attached.
   */
  static async delete(id: string) {
    const count = await prisma.knowledgeItem.count({ where: { categoryId: id } });
    if (count > 0) {
      throw new Error(`Cannot delete category with ${count} linked knowledge items.`);
    }

    return prisma.category.delete({ where: { id } });
  }
}
