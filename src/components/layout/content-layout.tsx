import * as React from 'react';

import { Head } from '@/components/seo/head';
import { Navbar } from '@/features/navbar';
import { Footer } from '@/features/layouts/footer';

type ContentLayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const ContentLayout = ({ children, title }: ContentLayoutProps) => {
  return (
    <>
      <Head title={title} />
      <Navbar />
      <main className="flex flex-col h-full">{children}</main>
      <Footer />
    </>
  );
};
