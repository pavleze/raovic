import { Link } from "react-router-dom";
import { PageHeader } from "../../shared/ui/PageHeader";
import { TeamCard } from "../../shared/ui/TeamCard";
import { ImageCarousel } from "../../shared/ui/ImageCarousel";
import { founders } from "../../shared/data/teamData";
import { ordinacijaGallery } from "../../shared/data/galleryData";

export function AboutPage() {
  return (
    <div className="inner-page">
      <PageHeader
        eyebrow="Ginekološka ordinacija Raović"
        title="O nama"
        lead="Specijalistička ginekološko-akušerska ordinacija Raović smeštena u samom srcu Vračara, brine o Vašem zdravlju od 2004. godine."
      />
      <div className="site-shell inner-page__content">

        {/* ── Intro ── */}
        <section className="about-section">
          <div className="about-visual">
            <div className="about-card">
              <ImageCarousel images={ordinacijaGallery} className="gallery--fill" />
            </div>
            <div className="about-tag">Privatna ordinacija · Vračar</div>
          </div>
          <div className="about-content">
            <p className="eyebrow eyebrow--dash">Ko smo mi</p>
            <h2>Dobrodošli u Ginekološku ordinaciju Raović</h2>
            <p>
              Naša ordinacija pruža potpunu ginekološku zaštitu i negu ženama u svim
              fazama života – od puberteta do menopauzalnog perioda. Pored toga, uspešno
              se bavimo lečenjem ženskog i muškog steriliteta, i pomažemo budućim
              roditeljima da planiraju trudnoću. Vodimo trudnoću od prvog trenutka, pa
              sve do postporođajnog perioda, jer znamo da je ovo najlepši, ali i
              najneizvesniji period u životu jedne žene. U svakom trenutku pružamo
              podršku našim pacijentima, i nastojimo da u najkraćem roku odgovorimo na
              sva pitanja, rešimo sve nedoumice, nađemo najbolja rešenja za probleme i
              damo najbolje savete. U potpunosti smo posvećeni ne samo ka lečenju, već i
              ka preventivi i očuvanju dragocenog ženskog zdravlja. Uvek smo okrenuti ka
              budućnosti i daljem stručnom usavršavanju i uvođenju najsavremenije
              opreme, prateći najnovije svetske standarde u oblasti medicine, a naročito
              ginekologije i akušerstva.
            </p>
            <p>
              Sa Vama ćemo proći kroz sve lepe, neizvesne i teške trenutke, jer su naši
              pacijenti stub ordinacije Raović.
            </p>
          </div>
        </section>

        {/* ── Citat + ključne činjenice, puna širina ── */}
        <section className="about-wide">
          <blockquote className="about-quote about-quote--plain">
            <span className="about-quote__label">Cilj naše ginekološke ordinacije</span>
            <p className="about-quote__text">
              Pružiti potpunu ginekološku zaštitu i negu ženama u svim fazama života
            </p>
            <footer className="about-quote__author">Slađana i Zoran Raović</footer>
          </blockquote>

          <div className="about-features about-features--wide">
            <div className="about-feature">
              <span className="about-feature-dot" />
              <p>Više od 20 godina iskustva u ginekologiji i akušerstvu</p>
            </div>
            <div className="about-feature">
              <span className="about-feature-dot" />
              <p>9 lekara specijalista, uključujući profesora i docenta medicine</p>
            </div>
            <div className="about-feature">
              <span className="about-feature-dot" />
              <p>Saradnja sa nefrologom, kardiologom, hematologom i ostalim specijalistima</p>
            </div>
            <div className="about-feature">
              <span className="about-feature-dot" />
              <p>Golsvordijeva 6, Vračar - diskretan ambijent u srcu Beograda</p>
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        <section className="at-section">
          <p className="eyebrow eyebrow--dash">Stručni tim</p>
          <h2 className="at-section__title">Upoznajte naš tim</h2>

          <div className="at-group">
            <h3 className="at-group__label">Osnivači</h3>
            <div className="at-grid at-grid--founders">
              {founders.map((d) => (
                <TeamCard key={d.name} {...d} accent />
              ))}
            </div>
          </div>

          <div className="at-section__more">
            <Link className="text-link" to="/tim">
              Pogledajte ceo tim
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="13 6 19 12 13 18" />
              </svg>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}

