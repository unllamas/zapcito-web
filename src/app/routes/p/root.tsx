import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useZap, getTagValue } from '@lawallet/react';
import { NostrEvent } from '@nostr-dev-kit/ndk';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

import { Container } from '@/features/layouts/container';
import { Zap } from '@/features/zap';

import { timeAgo, convertToHex, extractDomain, normalizeUrl } from '@/lib/utils';

// import { createZap } from '@/app/actions';

import { useProfile, useSubscribe } from 'nostr-hooks';
import { RELAYS } from '@/config/config';

import { MainLayout } from '@/components/layouts/main-layout';

export const ProfileRoot = () => {
  const { pubkey } = useParams();

  const key = convertToHex(pubkey || '');

  const filters = useMemo(() => [{ '#p': [key], kinds: [9735], limit: 12 }], [key]);

  const { profile } = useProfile({ pubkey: key || '' });
  // @ts-ignore
  const { events: zapcitos } = useSubscribe({ filters, relays: RELAYS });

  // Flow
  const [screen, setScreen] = useState<'information' | 'payment' | 'summary'>('information');
  const [isPaying, setIsPaying] = useState<boolean>(false);

  // Cantidad de Zapcitos
  const [count, setCount] = useState<number>(0);

  // Form
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isCopy, setIsCopy] = useState<boolean>(false);

  const copyToClipboard = (value: string) => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        // sendGAEvent({ event: 'buttonClicked', value: 'zap_invoice_copied' });
        toast.success('Copiado al portapapeles.');
        setIsCopy(true);
        setTimeout(() => {
          setIsCopy(false);
        }, 800);
      })
      .catch((err) => {
        console.error('Error al copiar al portapapeles:', err);
      });
  };

  const handleReset = () => {
    setScreen('information');
    setCount(0);
    setName('');
    setMessage('');
    setIsCopy(false);
  };

  const handleChangeCount = (value: number) => {
    if (value <= 0) {
      setCount(0);
    } else {
      setCount(value);
    }
  };

  const { invoice, createZapInvoice } = useZap({
    receiverPubkey: key || '',
  });

  const handleCreate = () => {
    if (invoice.loading) return;

    createZapInvoice(count, message, [
      ['name', name],
      ['message', message],
    ]).then((bolt11: string | undefined) => {
      console.log('bolt11', bolt11);
      if (!bolt11) {
        console.log('upds, algo paso mal');
        return;
      }

      setScreen('payment');
    });
  };

  // Pay with extension wallet
  const payWithWebLN = async (invoice: string) => {
    try {
      setIsPaying(true);
      if (!window.webln) {
        throw new Error('WebLN not detected');
      }
      await window.webln.enable();
      await window.webln.sendPayment(invoice);
    } catch (e) {
      toast.warning((e as Error).message);
      setIsPaying(false);
    }
  };

  // Watch if payed invoice
  useEffect(() => {
    if (invoice.payed) {
      // handleSaveTicket();
      // sendGAEvent({ event: 'buttonClicked', value: 'zap_invoice_paid' });
      // createZap(key, count);
      setScreen('summary');
      setIsPaying(false);
    }
  }, [invoice.payed]);

  return (
    <MainLayout title={profile?.displayName || 'Perfil'}>
      <div className="">
        {profile?.banner ? (
          <img
            src={profile?.banner}
            width={768}
            height={256}
            alt="Banner profile"
            style={{ aspectRatio: '3/1', objectFit: 'cover', margin: '0 auto' }}
            className="rounded-none md:rounded-3xl shadow-[rgba(250,107,188,_0.15)_0px_16px_64px_-12px]"
          />
        ) : (
          <Skeleton className="max-w-full w-[768px] h-[256px] mx-auto bg-card rounded-none md:rounded-3xl" />
        )}

        <div className="relative mt-[-40px] lg:mt-[-60px] mb-2">
          <Container>
            <div className="flex justify-between items-center gap-4 w-full lg:px-8">
              <Avatar className="w-[80px] h-[80px] lg:w-[120px] lg:h-[120px] bg-card border-4 border-background">
                <AvatarImage src={profile?.image || ''} loading="lazy" />
                <AvatarFallback>
                  <Skeleton className="bg-card" />
                </AvatarFallback>
              </Avatar>

              {/* {activeUser?.profile?.pubkey === profile?.pubkey && (
                <DrawerDialogDemo profile={profile} />
              )} */}
            </div>
          </Container>
        </div>
      </div>
      <Container>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Aside */}
          <aside className="w-full lg:max-w-[300px] lg:px-8">
            {/* Name */}
            {profile?.displayName ? (
              <h1 className="truncate overflow-hidden w-full max-w-[300px] font-bold text-xl whitespace-nowrap">
                {profile?.displayName}
              </h1>
            ) : (
              <Skeleton className="w-[80px] h-[28px] mb-2 bg-card rounded-full" />
            )}

            {/* Lud16 */}
            {profile?.lud16 || profile?.nip05 ? (
              <div className="flex items-center">
                <p className="truncate overflow-hidden w-full max-w-[300px] text-gray-500 whitespace-nowrap">
                  {profile?.lud16 || profile?.nip05}
                </p>
                <Button
                  size="sm"
                  variant="link"
                  onClick={() => copyToClipboard(profile?.lud16 || '')}
                >
                  <CopyIcon className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Skeleton className="w-[120px] h-[14px] bg-card rounded-full mt-4 mb-4" />
            )}

            {/* Description */}
            <div className="max-w-[300px]">
              {profile?.about ? (
                <p className="break-words w-full text-sm">{profile?.about}</p>
              ) : (
                <>
                  <Skeleton className="w-full h-[20px] mb-2 bg-card rounded-full" />
                </>
              )}

              <div className="flex">
                {profile?.website ? (
                  <a
                    href={normalizeUrl(profile?.website)}
                    title={profile?.website}
                    target="_blank"
                    tabIndex={-1}
                    rel="nofollow"
                  >
                    <Button variant="link" className="text-left p-0 gap-2">
                      <LinkIcon className="w-4 h-4" />
                      <span className="truncate overflow-hidden w-full lg:max-w-[200px] whitespace-nowrap">
                        {extractDomain(profile?.website)}
                      </span>
                    </Button>
                  </a>
                ) : (
                  <Skeleton className="w-full h-[20px] bg-card rounded-full mt-2" />
                )}
              </div>
            </div>

            {/* Top donadores */}
            {/* <div className='flex flex-col gap-4 mt-4'>
            <div className='flex flex-col'>
              <h2 className='font-bold text-lg'>Top donadores</h2>
              <p className='text-sm text-gray-500'>Lorem ipsum dolor sit amet.</p>
            </div>
            <Card className='p-4'>
              <div className='flex gap-4 justify-between'>
                <div className='flex'>
                  <Avatar className=' border-2 border-background'>
                    <AvatarImage src='https://github.com/unllamas.png' />
                    <AvatarFallback>JO</AvatarFallback>
                  </Avatar>
                  <Avatar className='ml-[-20px] border-2 border-background'>
                    <AvatarImage src='https://github.com/unllamas.png' />
                    <AvatarFallback>JO</AvatarFallback>
                  </Avatar>
                  <Avatar className='ml-[-20px] border-2 border-background'>
                    <AvatarImage src='https://github.com/unllamas.png' />
                    <AvatarFallback>JO</AvatarFallback>
                  </Avatar>
                </div>
                <Button size='sm' variant='ghost'>
                  See leederboard
                </Button>
              </div>
            </Card>
          </div> */}
          </aside>
          {/* <Card className='p-4'>
            <div className='flex flex-col gap-2'>
              <div className='flex gap-2'>
                <div className='w-[40px] px-2'></div>
                <div className='flex-1 px-2 text-sm text-gray-500'>Nombre</div>
                <div className='px-2 text-sm text-gray-500'>Cafecitos</div>
              </div>
              <Separator />
              <div className='flex flex-col gap-2'>
                <div className='flex gap-2'>
                  <div className='w-[40px] px-2 text-center'>
                    <Badge>1</Badge>
                  </div>
                  <div className='flex-1 px-2'>Jota</div>
                  <div className='px-2 font-semibold text-lg'>10</div>
                </div>
                <div className='flex gap-2'>
                  <div className='w-[40px] px-2 text-center'>
                    <Badge variant='secondary'>2</Badge>
                  </div>
                  <div className='flex-1 px-2'>Rapax</div>
                  <div className='px-2 font-semibold text-lg'>10</div>
                </div>
              </div>
            </div>
          </Card> */}

          {/* Contenido */}
          <div className="flex-1">
            <div className="lg:hidden mt-4 lg:m-0">
              <Drawer onClose={handleReset}>
                <DrawerTrigger asChild>
                  <Button size="lg" className="w-full">
                    Zapeame
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    {screen === 'information' && (
                      <>
                        <DrawerTitle>Ayudame con un zapeo</DrawerTitle>
                        <DrawerDescription>
                          Elegí un monto y agregá un mensaje personalizado para hacerlo más
                          especial.
                        </DrawerDescription>
                      </>
                    )}

                    {screen === 'payment' && (
                      <>
                        <DrawerTitle>¡Tu Zapcito a un paso!</DrawerTitle>
                        <DrawerDescription>
                          Escaneá el código QR para realizar el pago a través de Lightning Network.
                        </DrawerDescription>
                      </>
                    )}

                    {screen === 'summary' && (
                      <>
                        <img
                          src={'/iso.png'}
                          width={32}
                          height={32}
                          alt="Zapcito isotipo"
                          className="mx-auto mb-4"
                        />
                        <DrawerTitle>¡Zapeo exitoso!</DrawerTitle>
                        <DrawerDescription>
                          Tu Zapcito ha sido enviado con éxito. Bienvenid@ al movimiento Bitcoiner.
                        </DrawerDescription>
                      </>
                    )}
                  </DrawerHeader>

                  {screen === 'information' && (
                    <div className="flex flex-col gap-2 px-4">
                      <Zap value={count} onChange={handleChangeCount} />
                      <div className="flex flex-col gap-2">
                        <Input
                          type="text"
                          name="name"
                          id="name"
                          placeholder="Nombre (opcional)"
                          onChange={(e) => setName(e.target.value)}
                          defaultValue={name}
                          disabled={!count}
                        />
                        <Textarea
                          name="message"
                          id="message"
                          placeholder="Mensaje (opcional)"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          disabled={!count}
                        />
                      </div>
                    </div>
                  )}

                  {screen === 'payment' && (
                    <div className="p-4 bg-white">
                      <div className="max-w-[300px] mx-auto">
                        {invoice && (
                          <QRCodeSVG
                            value={invoice?.bolt11.toLowerCase()}
                            onClick={() => copyToClipboard(invoice?.bolt11.toLowerCase())}
                            className="cursor-pointer"
                            size={300}
                            imageSettings={{
                              // Iso 24x24, image 42x42
                              src: '/favicon.svg',
                              x: undefined,
                              y: undefined,
                              height: 42,
                              width: 42,
                              excavate: true,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  <DrawerFooter>
                    {screen === 'information' && (
                      <Button
                        size="lg"
                        className="w-full zap_generated"
                        disabled={count === 0}
                        variant={count === 0 ? 'outline' : 'default'}
                        onClick={handleCreate}
                      >
                        Invitame {count} Zapcitos
                      </Button>
                    )}
                    {screen === 'payment' && (
                      <div className="flex gap-2">
                        {window.webln && (
                          <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() => payWithWebLN(invoice?.bolt11.toLowerCase())}
                            disabled={isPaying}
                          >
                            Pagar con wallet
                          </Button>
                        )}
                        <Button
                          variant={isCopy ? 'outline' : 'default'}
                          className="w-full"
                          onClick={() => copyToClipboard(invoice?.bolt11.toLowerCase())}
                          disabled={isCopy}
                        >
                          {isCopy ? (
                            <>
                              <CheckIcon className="w-4 h-4" /> Copiado
                            </>
                          ) : (
                            'Copiar'
                          )}
                        </Button>
                      </div>
                    )}
                    <DrawerClose>
                      <Button variant="ghost" className="w-full">
                        {screen === 'summary' ? 'Cerrar' : 'Cancelar'}
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>

            {/* Invitame */}
            {screen === 'information' && (
              <div className="hidden lg:flex flex-col gap-2 mt-4">
                <div className="flex flex-col">
                  <h2 className="font-bold text-lg">Ayudame con un zapeo</h2>
                </div>
                <Zap value={count} onChange={handleChangeCount} />
                <Card className="flex flex-col gap-2 p-4">
                  <div className="flex flex-col gap-2">
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Nombre (opcional)"
                      onChange={(e) => setName(e.target.value)}
                      defaultValue={name}
                      disabled={!count}
                    />
                    <Textarea
                      name="message"
                      id="message"
                      placeholder="Mensaje (opcional)"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={!count}
                    />
                  </div>
                </Card>
                <Button
                  size="lg"
                  className="w-full zap_generated"
                  variant={count === 0 ? 'outline' : 'default'}
                  disabled={count === 0}
                  onClick={handleCreate}
                >
                  Invitame {count} Zapcitos
                </Button>
              </div>
            )}

            {screen === 'payment' && (
              <div className="hidden lg:flex flex-col gap-2 my-4">
                <div className="flex flex-col text-center">
                  <h2 className="font-bold text-lg">¡Tu Zapcito a un paso!</h2>
                  <p className="text-sm">
                    Escaneá el código QR para realizar el pago a través de Lightning Network.
                  </p>
                </div>
                <Card className="flex flex-col gap-2 p-4 bg-white">
                  {invoice && (
                    <div className="max-w-[300px] mx-auto py-4">
                      <QRCodeSVG
                        value={invoice?.bolt11.toLowerCase()}
                        onClick={() => copyToClipboard(invoice?.bolt11.toLowerCase())}
                        className="cursor-pointer"
                        size={300}
                        imageSettings={{
                          // Iso 24x24, image 42x42
                          src: '/favicon.svg',
                          x: undefined,
                          y: undefined,
                          height: 42,
                          width: 42,
                          excavate: true,
                        }}
                      />
                    </div>
                  )}
                </Card>
                <div className="flex gap-2">
                  {window.webln && (
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => payWithWebLN(invoice?.bolt11.toLowerCase())}
                      disabled={isPaying}
                    >
                      Pagar con wallet
                    </Button>
                  )}
                  <Button
                    variant={isCopy ? 'outline' : 'default'}
                    className="w-full"
                    onClick={() => copyToClipboard(invoice?.bolt11.toLowerCase())}
                    disabled={isCopy}
                  >
                    {isCopy ? (
                      <>
                        <CheckIcon className="w-4 h-4" /> Copiado
                      </>
                    ) : (
                      'Copiar'
                    )}
                  </Button>
                </div>
              </div>
            )}

            {screen === 'summary' && (
              <div className="flex flex-col gap-2">
                <Card>
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full mx-auto py-8 px-8">
                    <img src={'/iso.png'} width={32} height={32} alt="Zapcito isotipo" />
                    <div className="flex flex-col gap-1 text-center">
                      <h2 className="font-bold text-xl">¡Zapeo exitoso!</h2>
                      <p className="text-sm">
                        Tu Zapcito ha sido enviado con éxito. Bienvenid@ al movimiento Bitcoiner.
                      </p>
                    </div>
                  </div>
                </Card>
                <Button variant="ghost" onClick={handleReset}>
                  Volver
                </Button>
              </div>
            )}

            <div className="flex gap-4 items-center my-4">
              <Separator className="flex-1" />
              <p className="text-sm text-gray-500">Zapcitos</p>
              <Separator className="flex-1" />
            </div>

            {/* Listado de cafecitos */}
            <div className="flex flex-col gap-2 mb-4">
              {zapcitos?.length > 0 ? (
                zapcitos?.map((zap: any, key: any) => {
                  const zapRequest: NostrEvent = JSON.parse(getTagValue(zap?.tags, 'description'));

                  const name = getTagValue(zapRequest?.tags, 'name');
                  const message = getTagValue(zapRequest?.tags, 'message');
                  const amount = Number(getTagValue(zapRequest?.tags, 'amount'));

                  // TO-DO
                  // Modificar via invoice
                  if (!amount) return null;

                  if (amount / 1000 > 100000) {
                    return <img key={key} src="/cat.webp" alt="Cat :)" />;
                  }

                  return (
                    <Card key={key} className="p-4">
                      <div className="flex gap-4 justify-between items-start">
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex gap-1 items-center">
                            {name && (
                              <p>
                                <strong>{name}</strong>
                              </p>
                            )}
                            <p>
                              {name ? 'te hizo' : 'Te hicieron'} {amount / 1000}{' '}
                              {amount / 1000 === 1 ? 'zapcito' : 'zapcitos'}
                            </p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {timeAgo(zapRequest?.created_at)}
                          </span>
                          {message && <p className="">{message}</p>}
                        </div>
                        {/* <div className='flex-1'>
                        <Button size='icon' variant='secondary'>
                          <ShareIcon />
                        </Button>
                      </div> */}
                      </div>
                    </Card>
                  );
                })
              ) : (
                <Skeleton className="w-full h-[80px] bg-card rounded-lg" />
              )}
            </div>
          </div>
        </div>
      </Container>
    </MainLayout>
  );
};

function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      color="currentColor"
      fill="none"
    >
      <path
        d="M5 14.5C5 14.5 6.5 14.5 8.5 18C8.5 18 14.0588 8.83333 19 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      color="currentColor"
      fill="none"
    >
      <path
        d="M11.0991 3.00012C7.45013 3.00669 5.53932 3.09629 4.31817 4.31764C3.00034 5.63568 3.00034 7.75704 3.00034 11.9997C3.00034 16.2424 3.00034 18.3638 4.31817 19.6818C5.63599 20.9999 7.75701 20.9999 11.9991 20.9999C16.241 20.9999 18.3621 20.9999 19.6799 19.6818C20.901 18.4605 20.9906 16.5493 20.9972 12.8998"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.556 3.49612L11.0487 13.0586M20.556 3.49612C20.062 3.00151 16.7343 3.04761 16.0308 3.05762M20.556 3.49612C21.05 3.99074 21.0039 7.32273 20.9939 8.02714"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      color="currentColor"
      fill="none"
    >
      <path
        d="M9 15C9 12.1716 9 10.7574 9.87868 9.87868C10.7574 9 12.1716 9 15 9L16 9C18.8284 9 20.2426 9 21.1213 9.87868C22 10.7574 22 12.1716 22 15V16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H15C12.1716 22 10.7574 22 9.87868 21.1213C9 20.2426 9 18.8284 9 16L9 15Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.9999 9C16.9975 6.04291 16.9528 4.51121 16.092 3.46243C15.9258 3.25989 15.7401 3.07418 15.5376 2.90796C14.4312 2 12.7875 2 9.5 2C6.21252 2 4.56878 2 3.46243 2.90796C3.25989 3.07417 3.07418 3.25989 2.90796 3.46243C2 4.56878 2 6.21252 2 9.5C2 12.7875 2 14.4312 2.90796 15.5376C3.07417 15.7401 3.25989 15.9258 3.46243 16.092C4.51121 16.9528 6.04291 16.9975 9 16.9999"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// function PencilIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 24"
//       width="24"
//       height="24"
//       color="currentColor"
//       fill="none"
//     >
//       <path
//         d="M3.89089 20.8727L3 21L3.12727 20.1091C3.32086 18.754 3.41765 18.0764 3.71832 17.4751C4.01899 16.8738 4.50296 16.3898 5.47091 15.4218L16.9827 3.91009C17.4062 3.48654 17.618 3.27476 17.8464 3.16155C18.2811 2.94615 18.7914 2.94615 19.2261 3.16155C19.4546 3.27476 19.6663 3.48654 20.0899 3.91009C20.5135 4.33365 20.7252 4.54543 20.8385 4.77389C21.0539 5.20856 21.0539 5.71889 20.8385 6.15356C20.7252 6.38201 20.5135 6.59379 20.0899 7.01735L8.57816 18.5291C7.61022 19.497 7.12625 19.981 6.52491 20.2817C5.92357 20.5823 5.246 20.6791 3.89089 20.8727Z"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path
//         d="M6 15L9 18M8.5 12.5L11.5 15.5"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }
