import { useEffect, useLayoutEffect, useRef, useState } from "react";

const EMBED_SCRIPT = "https://www.instagram.com/embed.js";

// Objave se dodaju preko /admin (blog-posts.php na hostingu). Gde PHP ne radi
// (Vercel, lokalni dev), koriste se početne objave iz blog-posts-default.json.
async function loadPosts() {
  for (const url of ["/blog-posts.php", "/blog-posts-default.json"]) {
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) continue;
      const data = await res.json();
      const posts = Array.isArray(data) ? data : data.posts;
      if (Array.isArray(posts)) return posts;
    } catch {
      // probaj sledeći izvor
    }
  }
  return [];
}

// Instagram-ova skripta pretvara <blockquote class="instagram-media"> u ugrađen post.
function useInstagramEmbeds(posts) {
  useEffect(() => {
    if (!posts?.length) return;
    if (window.instgrm) {
      window.instgrm.Embeds.process();
      return;
    }
    if (document.querySelector(`script[src="${EMBED_SCRIPT}"]`)) return;
    const script = document.createElement("script");
    script.src = EMBED_SCRIPT;
    script.async = true;
    document.body.appendChild(script);
  }, [posts]);
}

// Kartice su iste visine: naslov ima mesta za 2 reda, opis za 4. Duži tekst
// se skraćuje i dobija dugme „Pročitaj više“.
function IgPostCard({ post }) {
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    if (expanded) return;
    const check = () => {
      const cut = (el) => el && el.scrollHeight > el.clientHeight + 1;
      setOverflows(cut(titleRef.current) || cut(textRef.current));
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [expanded, post.title, post.description]);

  return (
    <article className={`ig-post${expanded ? " is-expanded" : ""}`}>
      <h2 className="ig-post__title" ref={titleRef}>
        {post.title}
      </h2>
      <div className="ig-post__body">
        <p className="ig-post__text" ref={textRef}>
          {post.description}
        </p>
        {(overflows || expanded) && (
          <button
            type="button"
            className="ig-post__more"
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Prikaži manje" : "Pročitaj više"}
          </button>
        )}
      </div>
      {/* Omotač drži Instagram-ov okvir u kartici i dok se učitava */}
      <div className="ig-post__media">
        <blockquote
          className="instagram-media ig-post__embed"
          data-instgrm-permalink={post.url}
          data-instgrm-version="14"
        >
          {/* Vidi se dok se objava ne učita ili ako je Instagram blokiran */}
          <a href={post.url} target="_blank" rel="noopener noreferrer">
            Pogledajte objavu na Instagramu
          </a>
        </blockquote>
      </div>
    </article>
  );
}

export function BlogPage() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    let active = true;
    loadPosts().then((list) => active && setPosts(list));
    return () => {
      active = false;
    };
  }, []);

  useInstagramEmbeds(posts);

  return (
    <div className="inner-page inner-page--blog">
      <div className="site-shell inner-page__content">
        {posts === null ? null : posts.length === 0 ? (
          <div className="blog-empty">
            <p>Uskoro novi članci i saveti iz ordinacije Raović.</p>
          </div>
        ) : (
          <div className="ig-grid">
            {posts.map((post) => (
              <IgPostCard key={post.url} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
