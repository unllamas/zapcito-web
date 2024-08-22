import { nip19 } from '@lawallet/nostr-tools';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertToHex = (value: string): string | null => {
  try {
    if (value.startsWith('npub')) {
      const { data } = nip19.decode(value);
      return data as string;
    }

    return value;
  } catch (error) {
    console.error('Error al convertir la clave pública:', error);
    return null;
  }
};

export function timeAgo(timestamp: any) {
  const now = Math.floor(Date.now() / 1000); // Obtener el tiempo actual en segundos
  const secondsAgo = now - timestamp;

  const minutes = Math.floor(secondsAgo / 60);
  const hours = Math.floor(secondsAgo / 3600);
  const days = Math.floor(secondsAgo / 86400);
  const weeks = Math.floor(secondsAgo / 604800);
  const months = Math.floor(secondsAgo / 2592000);
  const years = Math.floor(secondsAgo / 31536000);

  if (secondsAgo < 60) {
    return `Hace ${secondsAgo} segundos`;
  } else if (minutes < 60) {
    return `Hace ${minutes} minutos`;
  } else if (hours < 24) {
    return `Hace ${hours} horas`;
  } else if (days < 7) {
    return `Hace ${days} días`;
  } else if (weeks < 4) {
    return `Hace ${weeks} semanas`;
  } else if (months < 12) {
    return `Hace ${months} meses`;
  } else {
    return `Hace ${years} años`;
  }
}

export const extractDomain = (url: string): string => {
  try {
    // Crear un objeto URL
    const parsedUrl = new URL(url);

    // Extraer el hostname (dominio completo)
    const hostname = parsedUrl.hostname;

    // Remover el prefijo 'www.' si está presente
    const domain = hostname.startsWith('www.') ? hostname.slice(4) : hostname;

    return domain;
  } catch (error) {
    return url;
  }
};

export const normalizeUrl = (input: string): string => {
  try {
    let domain: string;

    // Detectar si el input ya es una URL completa
    if (input.startsWith('http://') || input.startsWith('https://')) {
      const parsedUrl = new URL(input);
      domain = parsedUrl.hostname;
    } else {
      domain = input;
    }

    // Eliminar el prefijo 'www.' si está presente
    domain = domain.startsWith('www.') ? domain.slice(4) : domain;

    // Construir la URL completa
    const url = `https://${domain}`;

    return url;
  } catch (error) {
    console.error('Error al procesar el input:', error);
    return input;
  }
};
