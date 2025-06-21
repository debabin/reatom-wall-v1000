import fetches from '@siberiacancode/fetches';
import { createRoot } from 'react-dom/client';

import type { Profile } from './model';

import { App } from './App';
import { profile } from './model';
import { router } from './router';

import './assets/global.css';

const init = async () => {
  try {
    const userResponse = await fetches.get<Profile>('/api/user');
    profile.set(userResponse.data);

    if (!router.wall.exact()) {
      router.wall.go({ id: userResponse.data.id });
    }
  } catch {
    router.login.go();
  }

  createRoot(document.getElementById('root')!).render(<App />);
};

init();
