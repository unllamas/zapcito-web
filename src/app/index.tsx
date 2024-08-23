import { LaWalletConfig } from '@lawallet/react';
import { useAutoLogin, useNostrHooks } from 'nostr-hooks';

import { ThemeProvider } from '@/components/theme';

import { AppProvider } from './provider';
import { AppRouter } from './router';

import { config, RELAYS } from '@/config/config';
import NDK from '@nostr-dev-kit/ndk';
import { useMemo } from 'react';

export const App = () => {
  const ndk = useMemo(
    () =>
      new NDK({
        explicitRelayUrls: RELAYS,
        autoConnectUserRelays: false,
        autoFetchUserMutelist: false,
      }),
    [],
  );

  useNostrHooks(ndk);
  useAutoLogin();

  return (
    <LaWalletConfig config={config}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AppProvider>
          <AppRouter />
        </AppProvider>
      </ThemeProvider>
    </LaWalletConfig>
  );
};
