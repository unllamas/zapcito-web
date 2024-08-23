import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from 'nostr-hooks';

import { Head } from '@/components/seo/head';
import { Footer } from '@/features/layouts/footer';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useUser } from '@/hooks/use-user';

import { Container } from '@/features/layouts/container';
import { Skeleton } from '@/components/ui/skeleton';

function User() {
  const navigate = useNavigate();
  const { logout } = useLogin();

  const { activeUser, profile } = useUser();

  return (
    <>
      {!activeUser ? (
        <Button variant="link" asChild>
          <Link to="/login" className="menu_link" id="login">
            Ingresar
          </Link>
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="relative h-8 w-8 rounded-full">
              {profile?.image ? (
                <Avatar className="h-9 w-9">
                  <AvatarImage loading="lazy" src={profile?.image || '/profile.png'} />
                  <AvatarFallback>{profile?.displayName?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              ) : (
                <Skeleton className="w-9 h-9 bg-card" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-card text-text" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                {!profile?.displayName && (!profile?.lud16 || !profile?.nip05) ? (
                  <>
                    <p className="text-sm font-medium leading-none">Hola,</p>
                    <p className="text-xs leading-none text-muted-foreground">Annonymous</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium leading-none">{profile?.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {profile?.lud16 || profile?.nip05}
                    </p>
                  </>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => navigate(`/p/${activeUser?.pubkey || activeUser?.npub}`)}
              >
                Profile
                {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem> */}
              {/* <DropdownMenuItem>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem> */}
              {/* <DropdownMenuItem>New Team</DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              Cerrar sesión
              {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}

type MainLayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const MainLayout = (props: MainLayoutProps) => {
  const { children, title } = props;

  return (
    <>
      <Head title={title} />
      <nav className="flex items-center h-[60px] lg:my-4">
        <Container>
          <div className="flex gap-4 items-center justify-between">
            <div className="flex gap-2 items-center">
              <Link to="/">
                <img src="/logo.png" width={115} height={30} alt="Zapcito logo" />
              </Link>
            </div>
            <div className="flex items-center">
              {/* <Button size="sm" variant="link" asChild>
                <a href="/explore" tabIndex={-1} className="menu_link" id="explore">
                  Explorar
                </a>
              </Button> */}

              <User />
            </div>
          </div>
        </Container>
      </nav>
      <main className="flex flex-col">
        {children}
        <Footer />
      </main>
    </>
  );
};
