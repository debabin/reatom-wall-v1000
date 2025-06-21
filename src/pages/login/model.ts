import { action, computed, reatomForm, withAsync } from '@reatom/core';
import fetches from '@siberiacancode/fetches';
import { toast } from 'sonner';
import { z } from 'zod';

import type { Profile } from '@/model';

import { profile } from '@/model';
import { router } from '@/router';

export const loginAction = action(
  async (body: any) => await fetches.post<Profile>('/api/login', body)
).extend(withAsync());

export const loginForm = reatomForm(
  {
    login: '',
    password: ''
  },
  {
    schema: z.object({
      login: z.string().min(3, 'Login must be at least 3 characters'),
      password: z.string().min(3, 'Password must be at least 3 characters')
    }),
    keepErrorOnChange: false,
    onSubmit: async (state) => {
      try {
        const loginResponse = await loginAction(state);

        profile.set(loginResponse.data);
        router.wall.go({ id: loginResponse.data.id });
      } catch {
        toast.error('Invalid login or password');
      }
    }
  }
);

export const isLoading = computed(() => !!loginAction.pending() || !!loginForm.submit.pending());
