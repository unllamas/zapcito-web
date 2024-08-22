import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nip19 } from '@lawallet/nostr-tools';
import { splitHandle } from '@lawallet/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

import { Container } from '@/features/layouts/container';
import { ContentLayout } from '@/components/layout/content-layout';

// import { splitHandle } from '@lawallet/utils';

// import { createSearch } from './actions';

// Mock
const PROFILES = [
  {
    id: 'cee287bb0990a8ecbd1dee7ee7f938200908a5c8aa804b3bdeaed88effb55547',
    picture: 'https://m.primal.net/HWWM.png',
    name: 'Jona |🇦🇷',
    lud16: 'dios@lawallet.ar',
  },
  {
    id: '3748b5a01edca05ae9f7dd434679eb768193aa27262024ae89add65cdccc1965',
    picture: 'https://i.imgur.com/YQyX3Lo.png',
    name: 'Fer',
    lud16: 'fer@hodl.ar',
  },
  {
    id: '2ad91f1dca2dcd5fc89e7208d1e5059f0bac0870d63fc3bac21c7a9388fa18fd',
    picture: 'https://m.primal.net/HcNC.gif',
    name: 'Agustin Kassis',
    lud16: 'agustin@lawallet.ar',
  },
  {
    id: 'b632a9073e8337a228969f46badaac6eb0035d4a4e08fd37c82355d263559a11',
    picture:
      'https://image.nostr.build/8d71027dca097a196ae17935139415d3f6040a2ce83d3e7d5b1891164966221b.jpg',
    name: 'Jota',
    lud16: 'juan@lawallet.ar',
  },
  {
    id: '10fe7e324ad92e91a2c915934b9a349fc21d15d19d638ab61ed15bf65cd9b9df',
    picture:
      'https://image.nostr.build/24a76de6e7f2082c831d836f1e943be4209e13ba3be6dc59f668bc33389be437.gif',
    name: 'Rapax',
    lud16: 'rapax@lawallet.ar',
  },
];

// Función para mezclar (randomizar) un array
const shuffleArray = (array: any[]) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

// Mezclar el array PROFILES
const shuffledProfiles = shuffleArray(PROFILES);

export const HomeRoute = () => {
  const navigate = useNavigate();

  // Flow
  const [searchText, setSearchText] = useState<string>('');
  // const [message, setMessage] = useState<string | null>(null);

  // Search profile
  const handleSearch = async () => {
    // Verificar si el formato de la pubkey es válido
    let pubkey: string;
    if (searchText) {
      switch (true) {
        case searchText.includes('@'): {
          const [username, domain] = splitHandle(searchText);
          try {
            const response = await fetch(
              `https://${domain}/.well-known/nostr.json?name=${username}`,
            );
            if (!response) return null;
            let jsonResponse = await response.json();
            if (!jsonResponse || !jsonResponse.names || !jsonResponse.names[username])
              throw new Error('Invalid nip05');
            pubkey = jsonResponse.names[username];
            break;
          } catch (err) {
            toast.info('Ups...', {
              description: (err as Error).message,
            });
            return null;
          }
        }
        case searchText.startsWith('npub'): {
          // Decodificar npub a hex usando nostr-tools
          const decoded = nip19.decode(searchText);
          if (decoded.type === 'npub') {
            pubkey = decoded.data as string;
            break;
          } else {
            setSearchText('');
            toast.info('Ups...', {
              description: 'Formato de clave pública no válido.',
            });
            return null;
          }
        }
        case /^[0-9a-fA-F]{64}$/.test(searchText): {
          pubkey = searchText;
          break;
        }
        default: {
          setSearchText('');
          toast.info('Ups...', {
            description: 'Formato de clave pública no válido.',
          });
          return null;
        }
      }
      // Redirigir con la clave convertida
      // createSearch(pubkey);
      navigate(`/p/${pubkey}?ref=search`);
    } else {
      toast.info('Ups...', {
        description: 'No se proporcionó ninguna clave pública.',
      });
      return null;
    }

    return null;
  };

  const handlePasteInput = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSearchText(text);
    } catch (error) {
      toast.info('Ups...', {
        description: 'Hubo un error al intentar pegar.',
      });
      return null;
    }
  };

  return (
    <ContentLayout title="Inicio">
      <div className="flex flex-col justify-center items-center w-full max-w-[768px] min-h-[256px] mx-auto bg-gradient-to-r from-[#1F1C1E] to-[#272526] rounded-none lg:rounded-3xl px-4 text-center">
        <div className="relative z-10 flex flex-col items-center gap-2 max-w-[400px]">
          <h1 className="font-bold text-2xl lg:text-3xl">
            Zapeá satoshis, <br />
            recibí Zapcitos
          </h1>
          <p className="text-md">
            Apoyá a tu creador de contenido con Bitcoin gracias al poder de Lightning.
          </p>
        </div>
      </div>

      <Container>
        <div className="relative flex flex-col items-center gap-2 mt-[-30px] px-4 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-2 w-full">
            <div className="relative flex-1 h-[60px]">
              <Input
                type="text"
                placeholder="Buscar perfil"
                className="min-h-[60px] pl-4 pr-[100px]"
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
              />
              <div className="absolute top-0 right-3 flex items-center h-full">
                <Button variant="ghost" onClick={handlePasteInput}>
                  Pegar
                </Button>
              </div>
            </div>
            <Button
              className="flex gap-1 w-full lg:w-auto min-w-[60px] h-[50px] lg:h-[60px]"
              onClick={handleSearch}
              disabled={!searchText}
            >
              <SearchIcon className="w-4 h-4 lg:w-6 lg:h-6" />
              <span className="lg:hidden">Buscar</span>
            </Button>
          </div>
          {/* {message && <>{message}</>} */}
          <p className="text-center text-sm text-gray-500">Soporte para: npub, hex, nip05</p>
        </div>
      </Container>

      <Container>
        <div className="mt-12 mb-4">
          <h1 className="font-bold text-xl text-center">Explorá perfiles</h1>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a href={`/waitlist?ref=home`} className="w-full h-full" tabIndex={-1}>
            <Card className="flex flex-col justify-center items-center w-full h-full p-8 bg-primary/10 border-primary/35 border-dotted">
              {/* Info */}
              <p className="text-sm text-center">Se uno de los primeros en enterarte.</p>

              <div className="mt-2">
                <Button size="sm">Anotarme ahora</Button>
              </div>
            </Card>
          </a>
          {shuffledProfiles?.length &&
            shuffledProfiles.map((profile, key) => {
              return (
                <a key={key} href={`/p/${profile.id}`} className="w-full" tabIndex={-1}>
                  <Card className="flex flex-col justify-center items-center w-full p-8">
                    <Avatar className="w-[60px] h-[60px] bg-background border-2 border-card">
                      <AvatarImage src={profile?.picture || ''} loading="lazy" />
                      <AvatarFallback>
                        <Skeleton className="bg-card" />
                      </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex flex-col items-center gap-0 px-4">
                      {/* Name */}
                      {profile?.name ? (
                        <h2 className="font-bold">{profile?.name}</h2>
                      ) : (
                        <Skeleton className="w-[80px] h-[15px] my-1 bg-background rounded-full" />
                      )}

                      {/* Lud16 */}
                      {profile?.lud16 ? (
                        <p className="truncate overflow-hidden w-full lg:max-w-[200px] whitespace-nowrap text-sm">
                          {profile?.lud16}
                        </p>
                      ) : (
                        <Skeleton className="w-[120px] h-[14px] bg-background rounded-full mt-2" />
                      )}
                    </div>

                    <div className="mt-2">
                      <Button size="sm" variant="secondary">
                        Ver perfil
                      </Button>
                    </div>
                  </Card>
                </a>
              );
            })}
        </div>
      </Container>
    </ContentLayout>
  );
};

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      color="currentcolor"
      fill="none"
    >
      <path
        d="M17.5 17.5L22 22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
