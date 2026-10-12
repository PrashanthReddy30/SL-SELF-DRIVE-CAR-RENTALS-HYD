import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  canonical?: string;
  keywords?: string;
  schema?: Record<string, any>;
}

export default function SEO({ title, description, canonicalPath, canonical, keywords, schema }: SEOProps) {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Helper to set or create meta tags
    const setMetaTag = (attr: string, key: string, content: string) => {
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Update Primary Description
    setMetaTag('name', 'description', description);

    // 4. Update Keywords if provided
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }

    // 5. Update Open Graph Tags
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    
    const resolvedPath = canonical || canonicalPath || '';
    const fullCanonicalUrl = `https://slcarrentals.in${resolvedPath.startsWith('/') ? resolvedPath : (resolvedPath ? `/${resolvedPath}` : '')}`;
    setMetaTag('property', 'og:url', fullCanonicalUrl);
    setMetaTag('property', 'twitter:title', title);
    setMetaTag('property', 'twitter:description', description);

    // 6. Update Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullCanonicalUrl);

    // 7. Inject Custom Schema if present
    let schemaScript: HTMLScriptElement | null = null;
    if (schema) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.innerHTML = JSON.stringify(schema);
      schemaScript.id = 'page-schema-jsonld';
      document.head.appendChild(schemaScript);
    }

    // Cleanup schema script on unmount
    return () => {
      if (schemaScript && schemaScript.parentNode) {
        schemaScript.parentNode.removeChild(schemaScript);
      }
    };
  }, [title, description, canonicalPath, keywords, schema]);

  return null;
}
