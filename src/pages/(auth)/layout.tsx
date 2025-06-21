import type { ReactNode } from 'react';

import { reatomComponent } from '@reatom/react';
import { MoonIcon, SunIcon } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { profile, theme } from '@/model';

import { UserCombobox } from './-components';
import { isLoading, onLogout } from './model';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = reatomComponent(({ children }: AuthLayoutProps) => (
  <div className='flex max-w-lg mx-auto flex-col gap-4'>
    <header>
      <div className='py-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Avatar className='size-6'>
            <AvatarFallback className='text-sm'>{profile()!.emoji}</AvatarFallback>
          </Avatar>
          <span className='font-medium'>{profile()!.name}</span>
        </div>

        <UserCombobox />

        <div className='flex items-center gap-2'>
          <Button variant='outline' onClick={theme.toggle}>
            {theme() === 'light' ? <MoonIcon /> : <SunIcon />}
          </Button>
          <Button disabled={isLoading()} variant='outline' onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
    <div>{children}</div>
  </div>
));
