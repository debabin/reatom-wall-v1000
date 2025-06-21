import { reatomRoute } from '@reatom/core';
import fetches from '@siberiacancode/fetches';

import type { Post } from './model';

export const loginRoute = reatomRoute({
  path: 'login'
});

export const authRoute = reatomRoute({
  path: 'auth'
});

export const wallRoute = authRoute.route({
  path: 'wall/:id',
  loader: async ({ id }) => {
    const wallResponse = await fetches.get<{
      posts: Post[];
      hasMore: boolean;
    }>(`/api/wall/${id}`);

    return {
      id,
      posts: wallResponse.data.posts,
      hasMore: wallResponse.data.hasMore
    };
  }
});

export const router = {
  auth: authRoute,
  login: loginRoute,
  wall: wallRoute
};
