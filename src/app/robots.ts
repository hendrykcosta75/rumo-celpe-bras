import type { MetadataRoute } from "next";

/** Preview: nada indexado (o link não é divulgado sem OK do Hendryk). No lançamento, liberar /en e /es. */
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", disallow: "/" }] };
}
