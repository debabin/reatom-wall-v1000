import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import type { Profile } from '@/model';

import { cn } from '@/lib/utils';

import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface UserComboboxProps {
  isLoading?: boolean;
  placeholder?: string;
  selectedUser?: Profile;
  users: Profile[];
  onSearchChange?: (value: string) => void;
  onUserSelect?: (user: Profile) => void;
}

export const UserCombobox = ({
  users,
  selectedUser,
  onUserSelect,
  placeholder = 'Search users...',
  isLoading = false,
  onSearchChange
}: UserComboboxProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className='w-full justify-between'
          disabled={isLoading}
          variant='outline'
          role='combobox'
        >
          {selectedUser ? (
            <div className='flex items-center gap-2'>
              <span className='text-lg'>{selectedUser.emoji}</span>
              <span className='truncate'>{selectedUser.name}</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='w-full p-0'>
        <Command>
          <CommandInput onValueChange={onSearchChange} placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.name}
                  onSelect={() => {
                    onUserSelect?.(user);
                    setOpen(false);
                  }}
                >
                  <div className='flex items-center gap-2 w-full'>
                    <span className='text-lg'>{user.emoji}</span>
                    <span className='truncate'>{user.name}</span>
                  </div>
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      selectedUser?.id === user.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
