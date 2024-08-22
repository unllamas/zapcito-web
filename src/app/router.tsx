import { useMemo } from 'react';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useAutoLogin } from 'nostr-hooks';

export const createAppRouter = (_queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: '/',
      lazy: async () => {
        const { HomeRoute } = await import('./routes/home');
        return { Component: HomeRoute };
      },
    },
    {
      path: '*',
      lazy: async () => {
        const { NotFoundRoute } = await import('./routes/not-found');
        return { Component: NotFoundRoute };
      },
    },
    {
      path: '/p/:pubkey',
      lazy: async () => {
        const { ProfileRoot } = await import('./routes/p/root');
        return { Component: ProfileRoot };
      },
    },
    {
      path: '/login',
      lazy: async () => {
        const { LoginRoot } = await import('./routes/login');
        return { Component: LoginRoot };
      },
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  useAutoLogin();

  return <RouterProvider router={router} />;
};
