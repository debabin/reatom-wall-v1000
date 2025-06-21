import { reatomComponent } from '@reatom/react';
import { useDebounceCallback, useDisclosure } from '@siberiacancode/reactuse';
import { ChevronsUpDownIcon } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui';
import { Button } from '@/components/ui/button';
import { router } from '@/router';

import { onSearch, searchQueryField, users } from '../model';

export const UserCombobox = reatomComponent(() => {
  const combobox = useDisclosure();
  const debouncedOnSearch = useDebounceCallback(onSearch, 500);

  return (
    <Popover onOpenChange={combobox.toggle} open={combobox.opened}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={combobox.opened}
          className='w-[200px] justify-between'
          variant='outline'
          role='combobox'
        >
          Search users...
          <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput
            value={searchQueryField.value()}
            onValueChange={(value) => {
              searchQueryField.set(value);
              debouncedOnSearch();
            }}
            placeholder='Search users...'
          />
          <CommandList>
            <CommandGroup>
              {users().map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.id}
                  onSelect={() => {
                    router.wall.go({ id: user.id });
                    combobox.close();
                  }}
                >
                  <Avatar className='size-6'>
                    <AvatarFallback className='text-sm'>{user.emoji}</AvatarFallback>
                  </Avatar>
                  <span className='font-medium'>{user.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
