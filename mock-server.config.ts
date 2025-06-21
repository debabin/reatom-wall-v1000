import type { FlatMockServerConfig } from 'mock-config-server';

import { USERS } from './mock/database';
import { POSTS } from './mock/database/posts';

export default [
  {
    baseUrl: '/api',
    interceptors: {
      request: async ({ setDelay }) => {
        await setDelay(1000);
      }
    }
  },
  {
    configs: [
      {
        path: '/logout',
        method: 'post',
        routes: [
          {
            data: undefined,
            interceptors: {
              response: (_, { clearCookie }) => clearCookie('auth')
            }
          }
        ]
      },
      {
        path: '/wall/:id',
        method: 'get',
        routes: [
          {
            data: [],
            interceptors: {
              response: (_, { request }) => {
                const id = request.params.id;
                const cursor = Number(request.query.cursor);

                const posts = POSTS[id];

                const cursorIndex = posts.findIndex((post) => post.id === cursor);

                const nextIndex = cursorIndex + 1 + 5;
                return {
                  posts: posts.slice(cursorIndex + 1, nextIndex),
                  hasMore: posts.length > nextIndex
                };
              }
            }
          }
        ]
      },
      {
        path: '/wall/:id',
        method: 'delete',
        routes: [
          {
            data: undefined,
            interceptors: {
              response: (_, { request }) => {
                const id = request.params.id;
                const postId = Number(request.query.postId);

                const postIndex = POSTS[id].findIndex((post) => post.id === postId);

                POSTS[id].splice(postIndex, 1);
              }
            }
          }
        ]
      },
      {
        path: '/wall',
        method: 'post',
        routes: [
          {
            data: undefined,
            interceptors: {
              response: (_, { request }) => {
                const post = request.body.post;
                const user = USERS[request.cookies.auth as keyof typeof USERS];

                POSTS[user.id].unshift({
                  id: POSTS[user.id].length + 1,
                  text: post,
                  author: user.name,
                  createdAt: new Date(),
                  reactions: []
                });
              }
            }
          }
        ]
      },
      {
        path: '/wall/:id/reactions',
        method: 'post',
        routes: [
          {
            data: undefined,
            interceptors: {
              response: (_, { request }) => {
                const postId = Number(request.query.postId);
                const emoji = request.body.emoji;

                const post = POSTS[request.cookies.auth].find((post) => post.id === postId);

                if (!post) return;

                const existingReaction = post.reactions.find(
                  (reaction) => reaction.emoji === emoji
                );

                if (existingReaction) {
                  existingReaction.count++;
                } else {
                  post.reactions.push({
                    emoji,
                    count: 1
                  });
                }
              }
            }
          }
        ]
      },
      {
        path: '/login',
        method: 'post',
        routes: [
          {
            data: USERS.siberiacancode,
            entities: {
              body: {
                login: 'siberiacancode'
              }
            },

            interceptors: {
              response: (_, { request, setCookie }) => {
                const login = request.body.login;
                setCookie('auth', login, {
                  httpOnly: true,
                  secure: false,
                  sameSite: 'lax'
                });

                return USERS[login as keyof typeof USERS];
              }
            }
          }
        ]
      },
      {
        path: '/user',
        method: 'get',
        routes: [{ data: undefined }],
        interceptors: {
          response: (_, { request, setStatusCode }) => {
            const token = request.cookies.auth;

            const user = USERS[token as keyof typeof USERS];
            if (!user) {
              setStatusCode(401);
              return;
            }

            return user;
          }
        }
      },
      {
        path: '/users/search',
        method: 'get',
        routes: [{ data: undefined }],
        interceptors: {
          response: (_, { request }) => {
            const query = request.query.q as string;

            const users = Object.values(USERS);

            if (!query) return users.slice(0, 5);

            const filteredUsers = users.filter(
              (user) =>
                user.name.toLowerCase().includes(query.toLowerCase()) ||
                user.status.toLowerCase().includes(query.toLowerCase())
            );

            return filteredUsers.slice(0, 5);
          }
        }
      }
    ]
  }
] as FlatMockServerConfig;
