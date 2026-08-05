/**
 * <JsonLd /> — renders a JSON-LD <script> block in the document head.
 *
 * Safe for SSR: outputs a plain <script type="application/ld+json"> tag.
 * Use in route components or any component that needs structured data.
 *
 * Usage:
 *   <JsonLd data={buildFaqJsonLd(faqs)} />
 *   <JsonLd data={[schema1, schema2]} />
 */
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default JsonLd;
