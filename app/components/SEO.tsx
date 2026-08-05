/**
 * Legacy SEO component — now a no-op.
 *
 * SEO metadata (title, description, OG, Twitter, canonical) is managed by
 * route-level meta() exports using buildMeta(). This empty component exists
 * only so that page files copied from src/ still compile without needing
 * to strip every <SEO ... /> JSX call.
 *
 * It renders nothing. It will be fully removed once all pages are cleaned up.
 */
export function SEO(_props: Record<string, unknown>) {
  return null;
}

export default SEO;
