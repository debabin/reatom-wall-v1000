import { bindField, reatomComponent } from '@reatom/react';
import { useIntersectionObserver } from '@siberiacancode/reactuse';
import { Loader2Icon, Trash2Icon } from 'lucide-react';

import { Button, ReactionButton, Textarea } from '@/components/ui';
import { profile } from '@/model';
import { wallRoute } from '@/router';

import { loadMorePosts, onDeletePost, onReactionToggle, onSend, postField } from './model';

export const WallPage = reatomComponent(() => {
  const intersectionObserver = useIntersectionObserver<HTMLDivElement>({
    onChange: (entry) => {
      if (entry.isIntersecting) loadMorePosts();
    },
    rootMargin: '100px',
    enabled: wallRoute.loader.data()!.hasMore
  });

  return (
    <>
      {profile()!.id === wallRoute.loader.data()!.id && (
        <form
          className='flex flex-col gap-1 items-end mb-10'
          onSubmit={(event) => {
            event.preventDefault();
            onSend();
          }}
        >
          <Textarea
            {...bindField(postField)}
            className='mb-4'
            placeholder='What is on your mind?'
          />
          <div>
            <Button type='submit'>Send</Button>
          </div>
        </form>
      )}

      <div className='flex flex-col gap-8'>
        {wallRoute.loader.data()!.posts.map((post) => (
          <div key={post.id} className='border-none shadow-none flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center justify-between'>
                <div className='text-md'>{post.author}</div>
                {wallRoute.loader.data()!.id === profile()!.name && (
                  <Button
                    className='text-red-500 dark:text-red-400 hover:text-red-700 hover:bg-red-50'
                    size='sm'
                    variant='ghost'
                    onClick={() => onDeletePost(post.id)}
                  >
                    <Trash2Icon className='h-4 w-4' />
                  </Button>
                )}
              </div>
              <div className='text-xs text-muted-foreground'>
                {new Date(post.createdAt).toISOString().split('T')[0]}
              </div>
            </div>
            <div className='text-xl'>{post.text}</div>
            <ReactionButton
              currentUser={profile()!.name}
              onReactionToggle={(emoji) => onReactionToggle(post.id, emoji)}
              reactions={post.reactions}
            />
          </div>
        ))}

        <div ref={intersectionObserver.ref} className='flex justify-center py-8'>
          {loadMorePosts.pending() ? (
            <div className='flex items-center gap-2 text-muted-foreground'>
              <Loader2Icon className='h-4 w-4 animate-spin' />
              <span>Loading more {wallRoute.loader.data()!.id} posts...</span>
            </div>
          ) : (
            <div className='h-4' />
          )}
        </div>
      </div>
    </>
  );
});
