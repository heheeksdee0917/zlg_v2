import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  schema?: object;
}

const SITE_URL = 'https://zlgdesign.com';

export function SEO({ title, description, canonical, image, schema }: SEOProps) {
  const absoluteImage = image
    ? image.startsWith('http')
      ? image
      : `${SITE_URL}${image}`
    : undefined;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {canonical && <meta property="og:url" content={canonical} />}
      {absoluteImage && <meta property="og:image" content={absoluteImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {absoluteImage && <meta name="twitter:image" content={absoluteImage} />}

      {/* Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}