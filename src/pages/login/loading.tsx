import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Skeleton
} from '@/components/ui';

export const LoginLoading = () => (
  <div className='flex items-center justify-center min-h-screen m-auto min-w-screen'>
    <Card className='w-[400px]'>
      <CardHeader>
        <CardTitle>
          <Skeleton className='h-12 w-24' />
        </CardTitle>
        <CardDescription>
          <Skeleton className='h-4 w-64' />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid gap-4'>
          <Skeleton className='h-8 w-full' />

          <Skeleton className='h-8 w-full' />
        </div>
      </CardContent>
      <CardFooter className='flex flex-col gap-4'>
        <Skeleton className='h-10 w-full' />
      </CardFooter>
    </Card>
  </div>
);
