import { useEffect, useState } from 'react';
import { NDKUserProfile } from '@nostr-dev-kit/ndk';
import { useActiveUser, useLogin } from 'nostr-hooks';

import { Container } from '@/features/layouts/container';
import { Button } from '@/components/ui/button';

import { UserNav } from './user-nav';

export const Navbar = () => {
  const { activeUser } = useActiveUser({ fetchProfile: true });
  const { logout } = useLogin();

  const [profile, setProfile] = useState<NDKUserProfile | null>();

  useEffect(() => {
    !profile && setProfile(activeUser?.profile);
  }, [activeUser]);

  const handleLogout = () => {
    setProfile(null);
    logout();
  };

  return (
    <>
      <nav className="flex items-center h-[60px] lg:my-4">
        <Container>
          <div className="flex gap-4 items-center justify-between">
            <div className="flex gap-2 items-center">
              <a href="/">
                <img src="/logo.png" width={115} height={30} alt="Zapcito logo" />
              </a>
              {/* <span className='text-sm text-text'>/ Perfil</span> */}
            </div>
            <div className="flex items-center">
              <Button size="sm" variant="link" asChild>
                <a href="/explore" tabIndex={-1} className="menu_link" id="explore">
                  Explorar
                </a>
              </Button>

              <UserNav user={profile} npub={activeUser?.npub || null} logout={handleLogout} />
            </div>
          </div>
        </Container>
      </nav>
    </>
  );
};
