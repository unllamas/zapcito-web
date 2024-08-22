// import { useState } from 'react';
// import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useLogin, useActiveUser } from 'nostr-hooks';

import { ContentLayout } from '@/components/layout/content-layout';

// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const LoginRoot = () => {
  const navigate = useNavigate();
  const { loginWithExtention } = useLogin();
  const { activeUser } = useActiveUser();

  // Flow
  // const [secret, setSecret] = useState<string>('');

  // const handlePasteInput = async () => {
  //   try {
  //     const text = await navigator.clipboard.readText();
  //     setSecret(text);
  //   } catch (error) {
  //     toast.info('Ups...', {
  //       description: 'Hubo un error al intentar pegar.',
  //     });
  //     return null;
  //   }
  // };

  if (activeUser?.pubkey) navigate('/');

  return (
    <ContentLayout title="Ingresar">
      <div className="flex h-screen w-full bg-background">
        <div className="container mx-auto flex max-w-md flex-col items-center gap-4 px-4">
          <img src="/lock.png" alt="Lock icon by Yassine Design" width={200} height={200} />
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-semibold text-lg">Ingresá a Zapcito</h2>
            <p className="text-gray-500">
              Conectate y accede a todas las funciones que tenemos para ofrecerte.
            </p>
          </div>
          <Tabs defaultValue="extension" className="w-full">
            <TabsList className="w-full bg-card">
              <TabsTrigger className="flex-1" value="extension">
                Extensión
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="secret" disabled>
                Clave secreta
              </TabsTrigger>
            </TabsList>
            <TabsContent className="flex flex-col gap-4" value="extension">
              <div className="flex flex-col gap-2">
                <Button className="w-full" onClick={() => loginWithExtention()} disabled={false}>
                  Ingresar con extensión
                </Button>
                <Button className="w-full" onClick={() => navigate('/')} variant="ghost">
                  Volver al inicio
                </Button>
              </div>
              <div className="flex flex-col text-sm text-center">
                <p className="text-gray-500">¿Aún no tenés?</p>
                <div className="flex justify-center items-center gap-1 text-sm">
                  <span>Recomendamos instalar </span>
                  {/* <Link href=''>
                  <Button variant='link' size='sm' className='p-0 text-md'>
                    Nos2x
                  </Button>
                </Link>
                <span>or</span> */}
                  <Button variant="link" size="sm" className="p-0 text-md" asChild>
                    <a href="https://getalby.com/" target="_blank">
                      Alby
                    </a>
                  </Button>
                </div>
              </div>
            </TabsContent>
            {/* <TabsContent className="flex flex-col gap-4" value="secret">
              <div className="flex flex-col gap-2">
                <Label htmlFor="secret">Tu clave secreta</Label>
                <div className="relative w-full">
                  <Input
                    className="pr-[70px]"
                    id="secret"
                    type="password"
                    placeholder="Formato hex o nsec..."
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                  />
                  <div className="absolute top-0 right-[2px] flex items-center h-full">
                    <Button variant="ghost" size="sm" onClick={handlePasteInput}>
                      Pegar
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  className="w-full"
                  disabled={!secret}
                  onClick={() => loginWithSecretKey({ secretKey: secret })}
                >
                  Ingresar
                </Button>
                <Button className="w-full" onClick={() => navigate('/')} variant="ghost">
                  Volver al inicio
                </Button>
              </div>
              <div className="text-sm text-center">
                <p className="text-gray-500">¿Aún no tenés?</p>
                <Button variant="link" size="sm" asChild>
                  <a href="">Generar una aleatoria</a>
                </Button>
              </div>
            </TabsContent> */}
          </Tabs>
        </div>
      </div>
    </ContentLayout>
  );
};
