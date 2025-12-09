import { Prisma } from '@prisma/client';
import { prisma } from './context';
import type { GraphQLContext } from './context';

function requireAuth(ctx: GraphQLContext) {
  if (!ctx.userId || !ctx.sessionEmail) {
    throw new Error('Unauthorized');
  }
}

function requireAdmin(ctx: GraphQLContext) {
  requireAuth(ctx);
  if (ctx.role !== 'ADMIN') {
    throw new Error('Forbidden');
  }
}

export const resolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      if (!ctx.sessionEmail) return null;
      return prisma.user.findUnique({ where: { email: ctx.sessionEmail } });
    },
    plastics: (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      if (ctx.role === 'ADMIN') return prisma.plastic.findMany();
      return prisma.plastic.findMany({ where: { active: true } });
    },
    colors: (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      if (ctx.role === 'ADMIN') return prisma.color.findMany();
      return prisma.color.findMany({ where: { available: true } });
    },
    myOrders: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return prisma.order.findMany({
        where: { userId: ctx.userId, userHidden: false },
        include: { color: true, material: true, user: true },
        orderBy: { createdAt: 'desc' }
      });
    },
    orders: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      return prisma.order.findMany({
        include: { color: true, material: true, user: true },
        orderBy: { createdAt: 'desc' }
      });
    }
  },
  Mutation: {
    createOrder: async (_parent: unknown, { input }: { input: Prisma.OrderUncheckedCreateInput }, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return prisma.order.create({
        data: {
          modelUrl: input.modelUrl,
          notes: input.notes,
          colorId: input.colorId,
          materialId: input.materialId,
          userId: ctx.userId!
        },
        include: { color: true, material: true, user: true }
      });
    },
    updateOrderStatus: async (_parent: unknown, { id, status }: { id: string; status: string }, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      return prisma.order.update({
        where: { id },
        data: { status: status as any },
        include: { color: true, material: true, user: true }
      });
    },
    deleteOrder: async (_parent: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      requireAuth(ctx);
      const order = await prisma.order.findUnique({ where: { id } });
      if (!order || order.userId !== ctx.userId) {
        throw new Error('Not found');
      }
      const canDelete = order.status === 'PENDING';
      if (!canDelete) {
        throw new Error('Order cannot be deleted in its current state');
      }
      await prisma.order.update({ where: { id }, data: { userHidden: true } });
      return true;
    },
    addPlastic: async (_: unknown, { input }: { input: Prisma.PlasticCreateInput }, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      return prisma.plastic.create({ data: input });
    },
    updatePlastic: async (_: unknown, { id, input }: { id: string; input: Prisma.PlasticUpdateInput }, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      return prisma.plastic.update({ where: { id }, data: input });
    },
    deletePlastic: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      await prisma.plastic.delete({ where: { id } });
      return true;
    },
    addColor: async (_: unknown, { input }: { input: Prisma.ColorCreateInput }, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      return prisma.color.create({ data: input });
    },
    updateColor: async (_: unknown, { id, input }: { id: string; input: Prisma.ColorUpdateInput }, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      return prisma.color.update({ where: { id }, data: input });
    },
    deleteColor: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      await prisma.color.delete({ where: { id } });
      return true;
    }
  },
  Order: {
    createdAt: (parent: any) =>
      parent.createdAt instanceof Date ? parent.createdAt.toISOString() : parent.createdAt,
    updatedAt: (parent: any) =>
      parent.updatedAt instanceof Date ? parent.updatedAt.toISOString() : parent.updatedAt
  }
};
