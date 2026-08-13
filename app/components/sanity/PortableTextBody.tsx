import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from 'sanity';
import Link from 'next/link';
import { stegaClean } from 'next-sanity';

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h3: ({ children }) => <h3>{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => {
      const href = stegaClean(value?.href) || '';
      const isInternal = href.startsWith('/') || href.startsWith('#');

      if (isInternal) {
        return <Link href={href}>{children}</Link>;
      }

      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
  },
};

export default function PortableTextBody({
  value,
  className,
}: {
  value?: PortableTextBlock[] | null;
  className?: string;
}) {
  if (!value?.length) return null;

  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}
