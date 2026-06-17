import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { MicroLabel, SiteShell } from "@/components/site/SiteShell";
import { blogPosts } from "@/lib/site-data";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = blogPosts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.post;
    if (!p) return { meta: [{ title: "Post · Samarth Kashyap" }] };
    return {
      meta: [
        { title: `${p.title} · Samarth Kashyap` },
        { name: "description", content: p.description },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.description },
      ],
    };
  },
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center md:px-8">
        <h1 className="text-3xl font-bold">Post not found</h1>
        <Link to="/blog" className="mt-6 inline-block text-sm underline">
          ← All writing
        </Link>
      </div>
    </SiteShell>
  ),
  component: BlogPost,
});

function BlogPost() {
  const { post } = Route.useLoaderData();
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24">
        <Link
          to="/blog"
          className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> All writing
        </Link>
        <div className="flex items-center gap-3">
          <MicroLabel>
            {new Date(post.date).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </MicroLabel>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            · {post.readMinutes} min read
          </span>
        </div>
        <h1 className="mt-4 text-balance text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl">
          {post.title}
        </h1>
        <div className="mt-10 space-y-6 text-lg leading-relaxed text-muted-foreground">
          {post.body.map((para: string, i: number) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </article>
    </SiteShell>
  );
}
