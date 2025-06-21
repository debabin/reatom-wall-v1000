import { useDisclosure } from '@siberiacancode/reactuse';
import { SmileIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from './button';
import {
  EMOJI_CATEGORIES,
  EmojiPicker,
  EmojiPickerCategories,
  EmojiPickerContent,
  EmojiPickerHeader,
  EmojiPickerSearch,
  EmojiPickerSkinTone
} from './emoji-picker';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export interface ReactionButtonProps {
  className?: string;
  currentUser: string;
  onReactionToggle: (emoji: string) => void;
  reactions?: Array<{
    emoji: string;
    count: number;
  }>;
}

export const ReactionButton = ({
  reactions = [],
  onReactionToggle,
  className
}: ReactionButtonProps) => {
  const emojiPicker = useDisclosure();

  const onSelect = (emojiSkin: { native: string }) => {
    onReactionToggle(emojiSkin.native);
    emojiPicker.close();
  };

  const onReactionClick = (emoji: string) => onReactionToggle(emoji);

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {reactions.map((reaction) => (
        <button
          key={reaction.emoji}
          className='flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          onClick={() => onReactionClick(reaction.emoji)}
        >
          <span className='text-sm'>{reaction.emoji}</span>
          <span className='text-xs font-medium'>{reaction.count}</span>
        </button>
      ))}

      <Popover onOpenChange={emojiPicker.toggle} open={emojiPicker.opened}>
        <PopoverTrigger asChild>
          <Button
            className='size-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800'
            size='sm'
            variant='ghost'
          >
            <SmileIcon className='size-4' />
          </Button>
        </PopoverTrigger>
        <PopoverContent align='start' className='w-auto p-0'>
          <EmojiPicker onSelect={onSelect}>
            <EmojiPickerHeader>
              <EmojiPickerSearch placeholder='Search emoji...' />
              <EmojiPickerSkinTone />
            </EmojiPickerHeader>
            <EmojiPickerContent>
              <EmojiPickerCategories data={EMOJI_CATEGORIES} />
            </EmojiPickerContent>
          </EmojiPicker>
        </PopoverContent>
      </Popover>
    </div>
  );
};
