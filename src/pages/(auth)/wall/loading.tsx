import { Skeleton } from '@/components/ui';

export const WallLoading = () => (
  <div className='flex flex-col gap-8'>
    {[1, 2, 3].map((index) => (
      <div key={index} className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='w-32 h-5' />
          <Skeleton className='w-24 h-4' />
        </div>
        <Skeleton className='w-full h-16' />
      </div>
    ))}
  </div>
);
