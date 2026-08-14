import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import ServiceArticle, {
  type ServiceArticleData,
  type ServiceChild,
  type ServiceRelatedPost,

} from "@/components/ServiceArticle";
import servicesContent from "@/data/services-content.json";
import { getLocalServiceBySlug } from "@/lib/wp-content-stats.functions";

const SITE = "https://usmanjatoi.com";

type FallbackService = {
  slug: string;
  title: string;
  h1: string;
  paragraphs: string[];
  bullets: string[];
  content?: string | null;
};

const fallbackServices = servicesContent as Record<string, FallbackService>;

function text(value: string | null | undefined) {
  return (value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value: string, length: number) {
  return value.length > length ? `${value.slice(0, length - 1).trimEnd()}…` : value;
}

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    const local = await getLocalServiceBySlug({ data: { slug: params.slug } });
    if (!local && !fallbackServices[params.slug]) throw notFound();
    return local;
  },
  head: ({ params, loaderData }) => {
    const service = (loaderData?.service || fallbackServices[params.slug]) as
      ServiceArticleData | undefined;
    const url = `${SITE}/services/${params.slug}/`;
    if (!service) {
      return {
        meta: [
          { title: "Service not found — Usman Jatoi" },
          { name: "robots", content: "noindex" },
        ],
        links: [{ rel: "canonical", href: url }],
      };
    }
    const rawTitle = text(service.h1 || service.title);
    const description = truncate(
      text(
        service.paragraphs?.[0] ||
          service.excerpt ||
          `${service.title} services delivered by Usman Jatoi.`,
      ),
      158,
    );
    const pageTitle = truncate(`${rawTitle} — Usman Jatoi`, 60);
    const socialImage = `${SITE}/site-assets/Businessman-with-Rainbow-Lightbulb-Head-e1752653622894-745x1024.jpg`;
    const faqs = service.structured?.faqs?.faqs?.filter((item) => item.question && item.answer);
    return {
      meta: [
        { title: pageTitle },
        { name: "description", content: description },
        { property: "og:title", content: pageTitle },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:image", content: socialImage },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: socialImage },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Service",
                "@id": `${url}#service`,
                name: rawTitle,
                serviceType: service.title,
                description,
                url,
                provider: {
                  "@type": "Person",
                  "@id": `${SITE}/#person`,
                  name: "Usman Jatoi",
                  url: SITE,
                },
                areaServed: "Worldwide",
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: SITE },
                  { "@type": "ListItem", position: 2, name: "Services", item: `${SITE}/services/` },
                  { "@type": "ListItem", position: 3, name: service.title, item: url },
                ],
              },
              ...(faqs?.length
                ? [
                    {
                      "@type": "FAQPage",
                      "@id": `${url}#faqs`,
                      mainEntity: faqs.map((faq) => ({
                        "@type": "Question",
                        name: faq.question,
                        acceptedAnswer: {
                          "@type": "Answer",
                          text: faq.answer,
                        },
                      })),
                    },
                  ]
                : []),
            ],
          }),
        },
      ],
    };
  },
  component: ServicePage,
  notFoundComponent: () => (
    <div className="mx-auto grid min-h-screen max-w-xl place-items-center px-6 text-center">
      <div>
        <h1 className="text-4xl font-semibold">Service not found</h1>
        <p className="mt-4 text-neutral-600">
          This service may have moved or is not part of the local import.
        </p>
        <Link to="/services" className="mt-6 inline-block underline">
          Browse all services
        </Link>
      </div>
    </div>
  ),
});

function ServicePage() {
  const { slug } = Route.useParams();
  const local = Route.useLoaderData();
  const service = (local?.service || fallbackServices[slug]) as ServiceArticleData;
  const children = (local?.children || []) as ServiceChild[];
  const related = (local?.related || []) as ServiceRelatedPost[];
  return (
    <ServiceArticle
      service={{ ...service, slug }}
      children={children}
      childCount={local?.childCount || children.length}
      related={related}
    />
  );

}
