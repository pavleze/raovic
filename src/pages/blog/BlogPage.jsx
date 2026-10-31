import { useEffect } from "react";
import { instagramPosts } from "../../shared/data/instagramPosts";

const EMBED_SCRIPT = "https://www.instagram.com/embed.js";

// Instagram-ova skripta pretvara <blockquote class="instagram-media"> u ugrađen post.
function useInstagramEmbeds(count) {
  useEffect(() => {
    if (!count) return;
    if (window.instgrm) {
      window.instgrm.Embeds.process();
      return;
    }
    if (document.querySelector(`script[src="${EMBED_SCRIPT}"]`)) return;
    const script = document.createElement("script");
    script.src = EMBED_SCRIPT;
    script.async = true;
    document.body.appendChild(script);
  }, [count]);
}

export function BlogPage() {
  useInstagramEmbeds(instagramPosts.length);

  return (
    <div className="inner-page inner-page--blog">
      <div className="site-shell inner-page__content">
        {instagramPosts.length === 0 ? (
          <div className="blog-empty">
            <p>Uskoro novi članci i saveti iz ordinacije Raović.</p>
          </div>
        ) : (
          <div className="ig-grid">
            {instagramPosts.map((post) => (
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
