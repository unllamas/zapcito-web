import { Container } from './container';

import { Button } from '@/components/ui/button';

export const Footer = () => {
  return (
    <footer className="py-8 border-t-[1px] border-card mt-8">
      <Container>
        <div className="flex items-center justify-center gap-2">
          <p className="text-sm text-gray-500">® Zapcito, 2024</p>
          <span className="text-sm text-gray-500">-</span>
          <p className="text-sm">Con amor por</p>
          <Button size="sm" variant="link" className="p-0" asChild>
            <a
              href={`/p/cee287bb0990a8ecbd1dee7ee7f938200908a5c8aa804b3bdeaed88effb55547`}
              className="footer_link"
              id="by"
            >
              @unllamas
            </a>
          </Button>
        </div>
      </Container>
    </footer>
  );
};
