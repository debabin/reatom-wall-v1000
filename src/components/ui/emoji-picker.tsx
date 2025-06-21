import type EmojiMart from '@emoji-mart/data';
import type { ComponentProps } from 'react';

import data from '@emoji-mart/data';
import { useClickOutside } from '@siberiacancode/reactuse';
import { useVirtualizer } from '@tanstack/react-virtual';
import { createContext, use, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

export interface EmojiSkin {
  native: string;
  unified: string;
}

export interface Emoji {
  id: string;
  keywords: string[];
  name: string;
  shortcodes?: string;
  skins: EmojiSkin[];
}

const SKIN_TONES = {
  0: { name: 'default', color: '#FFCC33' },
  1: { name: 'light', color: '#FFE0BD' },
  2: { name: 'medium-light', color: '#F1C27D' },
  3: { name: 'medium', color: '#C68642' },
  4: { name: 'medium-dark', color: '#8D5524' },
  5: { name: 'dark', color: '#4C3117' }
} as const;

interface EmojiPickerContextParams {
  searchTerm: string;
  skinTone: number;
  onSearch: (term: string) => void;
  onSelect?: (emojiSkin: EmojiSkin) => void;
  onSkinToneSelect: (tone: number) => void;
}

const EmojiPickerContext = createContext<EmojiPickerContextParams>({} as EmojiPickerContextParams);

const useEmojiPicker = () => use(EmojiPickerContext);

export interface EmojiPickerProps extends Omit<ComponentProps<'div'>, 'onSelect'> {
  children?: React.ReactNode;
  onSelect?: (emojiSkin: EmojiSkin) => void;
}

const EmojiPicker = ({ className, onSelect, ...props }: EmojiPickerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [skinTone, setSkinTone] = useState(0);

  const onSearch = (term: string) => setSearchTerm(term);
  const onSkinToneSelect = (tone: number) => setSkinTone(tone);

  const value = useMemo(
    () => ({
      searchTerm,
      onSearch,
      skinTone,
      onSkinToneSelect,
      onSelect
    }),
    [searchTerm, onSearch, skinTone, onSkinToneSelect, onSelect]
  );

  return (
    <EmojiPickerContext value={value}>
      <div
        className={cn(
          'bg-card flex h-full max-h-80 w-full flex-col overflow-hidden rounded-md border border-gray-200 p-2 shadow-md dark:border-gray-700',
          className
        )}
        {...props}
      />
    </EmojiPickerContext>
  );
};

EmojiPicker.displayName = 'EmojiPickerRoot';

export type EmojiPickerSearchProps = ComponentProps<'input'>;

const EmojiPickerSearch = ({ className, ...props }: EmojiPickerSearchProps) => {
  const { onSearch, searchTerm } = useEmojiPicker();

  return (
    <input
      className={cn(
        'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className
      )}
      value={searchTerm}
      onChange={(event) => onSearch(event.target.value)}
      {...props}
    />
  );
};
EmojiPickerSearch.displayName = 'EmojiPickerSearch';

export type EmojiPickerHeaderProps = ComponentProps<'div'>;

const EmojiPickerHeader = ({ className, ...props }: EmojiPickerHeaderProps) => (
  <div className={cn('mb-2 flex items-center justify-between gap-2', className)} {...props} />
);
EmojiPickerHeader.displayName = 'EmojiPickerHeader';

export type EmojiPickerSkinToneProps = ComponentProps<'div'>;

const EmojiPickerSkinTone = ({ className, ...props }: EmojiPickerSkinToneProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { skinTone, onSkinToneSelect } = useEmojiPicker();

  const onChange = (tone: number) => onSkinToneSelect(tone);

  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  return (
    <div ref={ref} className={cn('relative', className)} {...props}>
      <button
        className='border-input bg-background ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex size-10 items-center justify-center gap-2 rounded-md border text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'
        type='button'
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className='size-3 rounded-full'
          style={{ backgroundColor: SKIN_TONES[skinTone as keyof typeof SKIN_TONES].color }}
        />
      </button>

      <div
        className={cn(
          'absolute right-0 z-50 overflow-hidden transition-all duration-200 ease-in-out',
          isOpen ? 'max-h-[200px] opacity-100' : 'pointer-events-none max-h-0 opacity-0'
        )}
      >
        <div className='bg-card flex flex-row gap-2 rounded-md p-2 shadow-md'>
          {Object.values(SKIN_TONES).map((tone, index) => (
            <button
              key={tone.color}
              className='group flex flex-col items-center'
              title={tone.name}
              onClick={() => onChange(index)}
            >
              <div
                className={cn(
                  'size-5 rounded-full transition-transform hover:scale-110',
                  skinTone === index && 'ring-primary ring-2'
                )}
                style={{ backgroundColor: tone.color }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
EmojiPickerSkinTone.displayName = 'EmojiPickerSkinTone';

export interface EmojiPickerContentProps extends ComponentProps<'div'> {
  children: React.ReactNode;
}

const EmojiPickerContent = ({ children, className, ...props }: EmojiPickerContentProps) => (
  <div className={cn('flex-1 overflow-x-hidden overflow-y-auto p-1', className)} {...props}>
    {children}
  </div>
);
EmojiPickerContent.displayName = 'EmojiPickerContent';

export interface EmojiPickerCategoryItemProps extends ComponentProps<'button'> {
  children: React.ReactNode;
  name: string;
}

const EmojiPickerCategoryItem = ({
  name,
  children,
  className,
  ...props
}: EmojiPickerCategoryItemProps) => (
  <button
    className={cn(
      'flex size-10 cursor-pointer items-center justify-center rounded text-xl hover:bg-gray-100 dark:hover:bg-gray-700',
      className
    )}
    title={name}
    type='button'
    {...props}
  >
    {children}
  </button>
);
EmojiPickerCategoryItem.displayName = 'EmojiPickerCategoryItem';

export interface EmojiPickerCategoryProps extends ComponentProps<'div'> {
  emojis: Emoji[];
  title: string;
}

const EmojiPickerCategory = ({ title, className, emojis, ...props }: EmojiPickerCategoryProps) => {
  const { skinTone, onSelect, searchTerm } = useEmojiPicker();

  const onEmojiSelect = (emoji: EmojiSkin) => onSelect?.(emoji);

  const filteredEmojis = emojis.filter((emoji) =>
    emoji.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (!filteredEmojis.length) {
    return null;
  }

  return (
    <div className={cn('mb-3', className)} {...props}>
      <div className='flex flex-row items-center justify-between'>
        <h3 className='text-muted-foreground text-sm font-medium capitalize'>{title}</h3>
      </div>
      <div className='grid grid-cols-6'>
        {filteredEmojis.map((emoji) => {
          const emojiSkin = emoji.skins[skinTone] ?? emoji.skins[0];
          return (
            <EmojiPickerCategoryItem
              key={emoji.id}
              name={emoji.name}
              onClick={() => onEmojiSelect(emojiSkin)}
            >
              {emojiSkin.native}
            </EmojiPickerCategoryItem>
          );
        })}
      </div>
    </div>
  );
};

EmojiPickerCategory.displayName = 'EmojiPickerCategory';

interface EmojiPickerCategoriesProps {
  className?: string;
  data: { id: string; emojis: Emoji[] }[];
}

const EmojiPickerCategories = ({ data, className }: EmojiPickerCategoriesProps) => {
  const { skinTone, onSelect, searchTerm } = useEmojiPicker();
  const parentRef = useRef<HTMLDivElement>(null);

  const flatData = useMemo(() => {
    return data.flatMap((category) => {
      const categoryItem = {
        type: 'category',
        id: category.id,
        label: category.id
      } as const;

      const categoryEmojis = category.emojis.filter(
        (emoji) => !searchTerm || emoji.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const emojiChunks = [];
      for (let i = 0; i < categoryEmojis.length; i += 6) {
        const chunk = categoryEmojis.slice(i, i + 6);
        if (chunk.length > 0)
          emojiChunks.push({
            id: `${category.id}-${i}`,
            type: 'emoji',
            emojis: chunk
          } as const);
      }

      if (emojiChunks.length === 0) return [];
      return [categoryItem, ...emojiChunks];
    });
  }, [searchTerm]);

  const rowVirtualizer = useVirtualizer({
    count: flatData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 4
  });

  return (
    <div ref={parentRef} className={cn('h-[230px] overflow-x-hidden overflow-y-auto', className)}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const item = flatData[virtualRow.index];

          return (
            <div
              key={item.id}
              style={{
                transform: `translateY(${virtualRow.start}px)`,
                height: `${virtualRow.size}px`
              }}
              className='absolute top-0 left-0 w-full'
            >
              {item.type === 'category' && (
                <h3 className='text-muted-foreground py-2 text-sm font-medium capitalize'>
                  {item.label}
                </h3>
              )}
              {item.type === 'emoji' && (
                <div className='grid grid-cols-6'>
                  {item.emojis.map((emoji) => {
                    const emojiSkin = emoji.skins[skinTone] ?? emoji.skins[0];
                    return (
                      <button
                        key={emoji.name}
                        className={cn(
                          'flex size-10 cursor-pointer items-center justify-center rounded text-xl hover:bg-gray-100 dark:hover:bg-gray-700',
                          className
                        )}
                        type='button'
                        onClick={() => onSelect?.(emojiSkin)}
                      >
                        {emojiSkin.native}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
EmojiPickerCategories.displayName = 'EmojiPickerCategories';

const VERSIONS = [
  { version: 15, emoji: '🫨' },
  { version: 14, emoji: '🫠' },
  { version: 13.1, emoji: '😶‍🌫️' },
  { version: 13, emoji: '🥸' },
  { version: 12.1, emoji: '🧑‍🦰' },
  { version: 12, emoji: '🥱' },
  { version: 11, emoji: '🥰' },
  { version: 5, emoji: '🤩' },
  { version: 4, emoji: '👱‍♀️' },
  { version: 3, emoji: '🤣' },
  { version: 2, emoji: '👋🏻' },
  { version: 1, emoji: '🙃' }
] as const;

const isEmojiSupported = (() => {
  if (typeof document === 'undefined') return () => 15;

  const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;

  const CANVAS_HEIGHT = 25;
  const CANVAS_WIDTH = 20;
  const textSize = Math.floor(CANVAS_HEIGHT / 2);

  ctx.font = `${textSize}px Arial, Sans-Serif`;
  ctx.textBaseline = 'top';
  ctx.canvas.width = CANVAS_WIDTH * 2;
  ctx.canvas.height = CANVAS_HEIGHT;

  return (unicode: string) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH * 2, CANVAS_HEIGHT);

    ctx.fillStyle = '#FF0000';
    ctx.fillText(unicode, 0, 22);

    ctx.fillStyle = '#0000FF';
    ctx.fillText(unicode, CANVAS_WIDTH, 22);

    const a = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
    const count = a.length;
    let i = 0;

    for (; i < count && !a[i + 3]; i += 4);

    if (i >= count) return false;

    const x = CANVAS_WIDTH + ((i / 4) % CANVAS_WIDTH);
    const y = Math.floor(i / 4 / CANVAS_WIDTH);
    const b = ctx.getImageData(x, y, 1, 1).data;

    if (a[i] !== b[0] || a[i + 2] !== b[2]) return false;
    return ctx.measureText(unicode).width < CANVAS_WIDTH;
  };
})();

const getEmojiVersion = () => {
  for (const { version, emoji } of VERSIONS) {
    if (isEmojiSupported(emoji)) {
      return version;
    }
  }
  return 1;
};

const EMOJIS_DATA = data as {
  categories: { id: string; emojis: string[] }[];
  emojis: Record<string, EmojiMart.Emoji>;
};

const EMOJI_VERSION = getEmojiVersion();
const EMOJI_CATEGORIES = EMOJIS_DATA.categories.map((category) => ({
  id: category.id,
  emojis: category.emojis
    .map((emojiId) => EMOJIS_DATA.emojis[emojiId])
    .filter((emoji) => emoji.version < EMOJI_VERSION)
}));

export {
  EMOJI_CATEGORIES,
  EMOJI_VERSION,
  EmojiPicker,
  EmojiPickerCategories,
  EmojiPickerCategory,
  EmojiPickerCategoryItem,
  EmojiPickerContent,
  EmojiPickerHeader,
  EmojiPickerSearch,
  EmojiPickerSkinTone,
  EMOJIS_DATA,
  getEmojiVersion
};
