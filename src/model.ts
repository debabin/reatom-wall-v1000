import { atom, effect } from '@reatom/core';

export interface PostReaction {
  count: number;
  emoji: string;
}

export interface Post {
  author: string;
  createdAt: Date;
  id: number;
  reactions: PostReaction[];
  text: string;
}

export interface Profile {
  emoji: string;
  id: string;
  name: string;
  status: string;
}

export const profile = atom<Profile>();
export const posts = atom<Record<string, Post[]>>({});
export const theme = atom<'dark' | 'light'>(
  (localStorage.getItem('theme') as 'dark' | 'light') || 'light'
).actions((target) => ({
  toggle: () => {
    const updatedTheme = target() === 'light' ? 'dark' : 'light';
    target.set(updatedTheme);
    document.documentElement.classList.toggle('dark', updatedTheme === 'dark');
    localStorage.setItem('theme', updatedTheme);
  }
}));

effect(() => {
  document.documentElement.classList.toggle('dark', theme() === 'dark');
});
