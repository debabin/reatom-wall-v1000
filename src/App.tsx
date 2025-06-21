import { reatomComponent } from '@reatom/react';
import { lazy, Suspense } from 'react';

import { Toaster } from '@/components/ui/sonner';

import { WallLoading } from './pages/(auth)/wall/loading';
import { LoginLoading } from './pages/login/loading';
import { router } from './router';

const LoginPage = lazy(() =>
  import('./pages/login/page').then((module) => ({ default: module.LoginPage }))
);

const WallPage = lazy(() =>
  import('./pages/(auth)/wall/page').then((module) => ({ default: module.WallPage }))
);

const AuthLayout = lazy(() =>
  import('./pages/(auth)/layout').then((module) => ({ default: module.AuthLayout }))
);

export const App = reatomComponent(() => (
  <div>
    <main>
      {router.login.exact() && (
        <Suspense fallback={<LoginLoading />}>
          <LoginPage />
        </Suspense>
      )}

      {router.wall.exact() && (
        <Suspense>
          <AuthLayout>
            <Suspense fallback={<WallLoading />}>
              {router.wall.loader.ready() ? <WallPage /> : <WallLoading />}
            </Suspense>
          </AuthLayout>
        </Suspense>
      )}

      <Toaster />
    </main>
  </div>
));
