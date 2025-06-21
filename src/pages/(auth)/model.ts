import { action, atom, computed, reatomField, withAsync } from '@reatom/core';
import fetches from '@siberiacancode/fetches';

import type { Profile } from '@/model';

import { profile } from '@/model';
import { router } from '@/router';

const logoutAction = action(
  async () =>
    await fetches.post('/api/logout', undefined, {
      parse: 'raw'
    })
).extend(withAsync());

export const onLogout = async () => {
  await logoutAction();
  profile.set(undefined);
  router.login.go();
};

export const isLoading = computed(() => !!logoutAction.pending());

export const searchQueryField = reatomField('', 'searchQuery');

// export const users = computed(async () => {
//   const query = searchQueryField.value();
//   if (!query.trim()) return [];

//   const response = await fetches.get<Profile[]>(`/api/search?q=${encodeURIComponent(query)}`);

//   return response.data;
// }).extend(withAsyncData({ initState: [] }));

export const users = atom<Profile[]>([]);
export const onSearch = action(async () => {
  const query = searchQueryField.value();
  if (!query.trim()) return [];

  const usersSearchResponse = await fetches.get<Profile[]>(
    `/api/users/search?q=${encodeURIComponent(query)}`
  );

  users.set(usersSearchResponse.data);
});

const init = action(async () => {
  const usersSearchResponse = await fetches.get<Profile[]>(`/api/users/search`);
  users.set(usersSearchResponse.data);
});

init();
