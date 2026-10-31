import { useEffect, useState } from "react";

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
              <article className="ig-post" key={post.url}>
                <h2 className="ig-post__title">{post.title}</h2>
                {post.description && <p className="ig-post__text">{post.description}</p>}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
