import { LaWalletConfig } from '@lawallet/react';
import { useNdk, useNostrHooks } from 'nostr-hooks';

import { ThemeProvider } from '@/components/theme';

import { AppProvider } from './provider';
import { AppRouter } from './router';

import { config, RELAYS } from '@/config/config';
import NDK from '@nostr-dev-kit/ndk';

const newNdk = new NDK({ explicitRelayUrls: RELAYS });

export const App = () => {
  useNostrHooks();

  const { setNdk } = useNdk();
  setNdk(newNdk); // this will replace the existing NDK instance with the new one

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
