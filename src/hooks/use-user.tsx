import { useMemo } from 'react';
import { useActiveUser, useProfile } from 'nostr-hooks';

export const useUser = () => {
  const { activeUser } = useActiveUser();

  const { profile } = useProfile(
    useMemo(() => (activeUser?.pubkey ? { pubkey: activeUser?.pubkey } : undefined), [activeUser]),
  );

  return {
    activeUser,
    profile,
  };
};
