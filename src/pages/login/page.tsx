import { bindField, reatomComponent } from '@reatom/react';
import { Loader2Icon } from 'lucide-react';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input
} from '@/components/ui';

import { isLoading, loginForm } from './model';

export const LoginPage = reatomComponent(() => {
  const loginField = bindField(loginForm.fields.login);
  const passwordField = bindField(loginForm.fields.password);

  return (
    <div className='flex items-center justify-center min-h-screen m-auto min-w-screen'>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          loginForm.submit();
        }}
      >
        <Card className='w-[400px]'>
          <CardHeader>
            <CardTitle className='text-4xl'>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4'>
              <Input id='login' type='login' placeholder='login' {...loginField} />
              {loginField.error && <p className='text-xs text-red-500'>{loginField.error}</p>}

              <Input id='password' type='password' placeholder='password' {...passwordField} />
              {passwordField.error && <p className='text-xs text-red-500'>{passwordField.error}</p>}
            </div>
          </CardContent>
          <CardFooter className='flex flex-col gap-4'>
            <Button className='w-full' disabled={isLoading()} type='submit'>
              {isLoading() && <Loader2Icon className='size-4 animate-spin mr-1' />}
              Submit
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
});
