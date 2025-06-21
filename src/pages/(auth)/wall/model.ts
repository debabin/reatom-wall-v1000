import { action, reatomField, withAsync } from '@reatom/core';
import fetches from '@siberiacancode/fetches';
import { toast } from 'sonner';

import type { Post } from '@/model';

import { profile } from '@/model';
import { wallRoute } from '@/router';

export const postField = reatomField(localStorage.getItem('postField') ?? '', 'postField');
postField.value.subscribe((value) => localStorage.setItem('postField', value));

export const onSend = action(async () => {
  const post = postField.value();
  if (!post.trim()) return;

  wallRoute.loader.data.set((data) => {
    const posts = data!.posts;
    const newPost = {
      id: posts.length + 1,
      text: post,
      author: profile()!.name,
      createdAt: new Date(),
      reactions: []
    };

    return {
      ...data!,
      posts: [newPost, ...posts]
    };
  });

  postField.set('');
  await fetches.post('/api/wall', { post });

  toast.success('Post sent');
});

export const onDeletePost = action(async (postId: number) => {
  wallRoute.loader.data.set((data) => {
    const posts = data!.posts;
    return {
      ...data!,
      posts: posts.filter((post) => post.id !== postId)
    };
  });

  await fetches.delete(`/api/wall/${wallRoute.loader.data()!.id}?postId=${postId}`);

  toast.success('Post deleted');
});

export const onReactionToggle = action(async (postId: number, emoji: string) => {
  wallRoute.loader.data.set((data) => {
    const posts = data!.posts;
    const post = posts.find((p) => p.id === postId);

    if (!post) return data;

    const existingReaction = post.reactions.find((reaction) => reaction.emoji === emoji);

    if (existingReaction) {
      existingReaction.count++;
    } else {
      post.reactions.push({
        emoji,
        count: 1
      });
    }

    return {
      ...data!,
      posts
    };
  });

  await fetches.post(
    `/api/wall/${wallRoute.loader.data()!.id}/reactions?postId=${postId}`,
    {
      emoji
    },
    {
      parse: 'raw'
    }
  );
});

export const loadMorePosts = action(async () => {
  const posts = wallRoute.loader.data()!.posts;
  const lastPost = posts[posts.length - 1]!;
  const cursor = lastPost.id;

  const response = await fetches.get<{
    posts: Post[];
    hasMore: boolean;
  }>(`/api/wall/${wallRoute.loader.data()!.id}?cursor=${cursor}`);

  const newPosts = response.data;

  wallRoute.loader.data.set((data) => ({
    ...data!,
    posts: [...data!.posts, ...newPosts.posts],
    hasMore: newPosts.hasMore
  }));
}).extend(withAsync());
