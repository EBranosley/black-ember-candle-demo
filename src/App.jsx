import React, { useEffect, useRef, useState } from "react";

/** Public folder paths work on GitHub Pages only when prefixed with Vite's base URL. */
function publicUrl(path) {
  const rel = path.startsWith("/") ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${rel}`;
}

const products = [
  {
    name: "Black Ember",
    notes: "Smoked cedar, amber, charred wood, dark musk",
    mood: "Smoke · warmth · depth",
    price: "$28",
    image: publicUrl("/images/candles/black-ember.png"),
  },
  {
    name: "Ironwood",
    notes: "Oak, leather, sandalwood, warm spice",
    mood: "Wood · leather · still air",
    price: "$28",
    image: publicUrl("/images/candles/ironwood.png"),
  },
  {
    name: "The Stoic",
    notes: "Cedar, bergamot, tobacco leaf, clean musk",
    mood: "Quiet · focus · low light",
    price: "$30",
    image: publicUrl("/images/candles/the-stoic.png"),
  },
  {
    name: "Midnight Leather",
    notes: "Dark leather, vanilla smoke, tonka, mahogany",
    mood: "Late hours · closeness",
    price: "$30",
    image: publicUrl("/images/candles/midnight-leather.png"),
  },
];

const heroAllCandlesBanner = publicUrl("/images/candles/all-candles-banner.png");

const HERO_HEADLINE = "You weren't supposed to find this place.";

function readEntranceUnlocked() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem("midnight-ember-entrance") === "1";
  } catch {
    return false;
  }
}

function persistEntranceUnlocked() {
  try {
    window.localStorage.setItem("midnight-ember-entrance", "1");
  } catch {
    /* ignore quota / private mode */
  }
}

function HeroSmokeHeadline({ className = "", style, onGone, id }) {
  const [phase, setPhase] = useState("idle");
  const timeoutsRef = useRef([]);

  const clearTimers = () => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const handlePointerEnter = () => {
    if (phase !== "idle") return;
    const stagger = 26;
    const dissolveMs = 580;
    const n = HERO_HEADLINE.length;
    const lastStart = Math.max(0, n - 1) * stagger;
    const dissolveEnd = lastStart + dissolveMs + 120;

    clearTimers();
    setPhase("dissolving");

    const t1 = setTimeout(() => {
      setPhase("gone");
      onGone?.();
    }, dissolveEnd);
    timeoutsRef.current.push(t1);
  };

  const charPhaseClass = phase === "dissolving" ? "hero-char--dissolve" : phase === "gone" ? "hero-char--gone" : "";

  const words = HERO_HEADLINE.split(" ");
  let delayIndex = 0;

  return (
    <h1
      id={id}
      aria-label={HERO_HEADLINE}
      style={style}
      className={`select-none ${className} ${phase === "idle" || phase === "dissolving" ? "cursor-default text-glow-ember" : ""} ${phase === "gone" ? "pointer-events-none" : ""}`}
      onPointerEnter={handlePointerEnter}
    >
      {/* Word units wrap as wholes; per-letter dissolve timing follows reading order. */}
      <span
        className="flex max-w-full flex-wrap justify-center gap-x-[0.35em] gap-y-[0.12em] text-pretty [overflow-wrap:anywhere]"
        aria-hidden
      >
        {words.map((word, wi) => (
          <span key={`${wi}-${word}`} className="inline-flex max-w-full flex-nowrap">
            {word.split("").map((ch, ci) => {
              const di = delayIndex++;
              return (
                <span
                  key={`${wi}-${ci}-${ch}`}
                  className={`hero-char ${charPhaseClass}`}
                  style={{ animationDelay: `${di * 26}ms` }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        ))}
      </span>
    </h1>
  );
}

function Button({ children, variant = "gold", className = "" }) {
  const base =
    "inline-flex items-center justify-center px-7 py-3.5 text-[11px] uppercase tracking-[0.22em] transition-all duration-700 ease-out cursor-pointer";
  const styles =
    variant === "gold"
      ? "border border-ember/40 text-ember bg-ember/5 hover:bg-ember/10 hover:border-ember/60 shadow-[0_0_40px_-8px_rgba(198,162,74,0.35)]"
      : "border border-white/10 text-stone-300 hover:border-white/25 hover:text-stone-100";

  return <button type="button" className={`${base} ${styles} ${className}`}>{children}</button>;
}

function ObjectFrame({ src, alt, className = "" }) {
  return (
    <div
      className={`relative overflow-hidden bg-midnight shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] ${className}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover object-center scale-[1.02] transition-transform duration-[1400ms] ease-out group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_20px_rgba(0,0,0,0.5)]" />
    </div>
  );
}

function HoldingRow({ product }) {
  return (
    <article className="group grid min-w-0 gap-8 border-b border-white/[0.06] py-16 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center md:gap-14 md:py-20">
      <ObjectFrame
        src={product.image}
        alt={`${product.name} in low light`}
        className="aspect-[16/10] min-h-0 min-w-0 md:aspect-[5/3]"
      />
      <div className="min-w-0 max-w-md">
        <p className="font-display text-[clamp(11px,2.6vw,13px)] uppercase tracking-[0.28em] text-ember-dim">{product.mood}</p>
        <h3 className="mt-4 font-display text-[clamp(1.75rem,3.8vw,3rem)] font-medium tracking-tight text-stone-100">
          {product.name}
        </h3>
        <p className="mt-5 text-[clamp(0.8125rem,1.5vw,0.875rem)] font-light leading-relaxed text-stone-500">{product.notes}</p>
        <div className="mt-10 flex flex-wrap items-baseline gap-6">
          <span className="font-display text-lg text-stone-400">{product.price}</span>
          <button
            type="button"
            className="text-[10px] uppercase tracking-[0.26em] text-ember/80 transition-colors duration-500 hover:text-ember"
          >
            Request availability
          </button>
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [entranceOpen, setEntranceOpen] = useState(readEntranceUnlocked);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (!entranceOpen) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    } else {
      html.style.overflow = "";
      body.style.overflow = "";
    }
    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, [entranceOpen]);

  const handleEntranceComplete = () => {
    persistEntranceUnlocked();
    setEntranceOpen(true);
  };

  return (
    <div
      className={
        entranceOpen
          ? "min-h-screen overflow-x-clip bg-midnight text-stone-200"
          : "h-[100dvh] max-h-[100dvh] overflow-x-clip bg-midnight text-stone-200"
      }
    >
      <div className="grain" aria-hidden />

      {!entranceOpen ? (
        <div
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-y-auto overscroll-contain bg-midnight px-[max(1rem,env(safe-area-inset-left),env(safe-area-inset-right))] py-[max(2rem,env(safe-area-inset-top),env(safe-area-inset-bottom))] sm:px-10 md:px-14 lg:px-20 vignette-entrance"
          role="dialog"
          aria-modal="true"
          aria-label="Midnight Ember entrance"
          aria-labelledby="entrance-gate-headline"
        >
          <div className="w-full min-w-0 max-w-[min(100%,52rem)] px-1 text-center sm:px-2">
            <HeroSmokeHeadline
              id="entrance-gate-headline"
              onGone={handleEntranceComplete}
              className="font-display text-[clamp(1.5rem,min(4.2vw,5.5vh),3.75rem)] font-medium leading-[1.22] tracking-tight text-stone-100 text-glow-ember [text-wrap:balance]"
            />
          </div>
        </div>
      ) : null}

      {entranceOpen ? (
        <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-700 ease-out ${
          scrolled ? "bg-midnight/90 py-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md" : "bg-transparent py-7"
        }`}
      >
        <div className="mx-auto flex min-w-0 max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(0.5rem,env(safe-area-inset-top))] md:px-10">
          <a
            href="#"
            className="min-w-0 shrink break-words font-display text-[clamp(1rem,min(2.8vw,1.75rem),1.75rem)] tracking-[0.12em] text-stone-100 md:text-2xl lg:text-[clamp(1.5rem,1.4vw,2rem)]"
          >
            Midnight Ember
          </a>
          <nav className="hidden items-center gap-10 text-[10px] uppercase tracking-[0.24em] text-stone-500 md:flex">
            <a href="#house" className="transition-colors duration-500 hover:text-ember">
              The house
            </a>
            <a href="#holdings" className="transition-colors duration-500 hover:text-ember">
              Objects
            </a>
            <a href="#access" className="transition-colors duration-500 hover:text-ember">
              Access
            </a>
          </nav>
        </div>
      </header>

      <main className="relative z-10 min-w-0 overflow-x-clip">
        <div className="relative z-10 min-w-0">
          {/* 1 — Mood & atmosphere */}
          <section className="relative flex min-w-0 flex-col overflow-x-clip pb-16 md:pb-24">
          <div className="absolute inset-0 bg-midnight" />
          <div
            className="absolute inset-0 z-[2] opacity-90"
            style={{
              background:
                "radial-gradient(ellipse 90% 65% at 50% 100%, rgba(198,162,74,0.07) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 50% 0%, rgba(20,18,16,0.9) 0%, transparent 50%)",
            }}
            aria-hidden
          />

          <div className="relative z-10 mx-auto w-full min-w-0 max-w-6xl px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-24 sm:px-6 md:pt-28">
            <div className="relative aspect-[5/4] w-full min-w-0 overflow-hidden rounded-sm bg-charcoal shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] sm:aspect-[2/1] md:aspect-[21/9]">
              <img
                src={heroAllCandlesBanner}
                alt="Midnight Ember candle collection"
                className="h-full w-full object-cover object-center"
                width={1920}
                height={820}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight/90 via-transparent to-black/20"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 to-transparent"
                aria-hidden
              />
            </div>
          </div>

          <div className="relative z-10 mx-auto w-full min-w-0 max-w-5xl px-[max(1rem,env(safe-area-inset-left))] pb-8 pr-[max(1rem,env(safe-area-inset-right))] pt-8 md:px-10 md:pt-10">
            <h1 className="sr-only">{HERO_HEADLINE}</h1>
            <div
              className="delay-hero-line mx-auto h-px max-w-xs bg-gradient-to-r from-transparent via-ember/35 to-transparent animate-rise"
              style={{ animationFillMode: "forwards" }}
              aria-hidden
            />
          </div>
        </section>

        {/* 2 — The house */}
        <section id="house" className="relative min-w-0 overflow-x-clip border-t border-white/[0.04] bg-charcoal">
          <div className="mx-auto max-w-3xl px-[max(1rem,env(safe-area-inset-left))] py-28 pr-[max(1rem,env(safe-area-inset-right))] md:px-10 md:py-36">
            <p className="text-center text-[10px] uppercase tracking-[0.35em] text-stone-600">The house</p>
            <h2 className="mt-10 text-balance text-center font-display text-[clamp(1.5rem,3.2vw,3.25rem)] font-medium leading-snug text-stone-100 lg:leading-[1.15]">
              For men who live with discipline, presence, and purpose.
            </h2>
            <p className="mt-12 text-pretty text-center text-[clamp(0.9375rem,1.6vw,1.0625rem)] font-light leading-[1.85] text-stone-500">
              Black Ember is a community for men who care about the atmosphere they create. Men who value calm over chaos,
              confidence over noise, and refinement over excess. Every scent is designed for masculine spaces that feel
              grounded, intentional, and controlled.
            </p>
          </div>

          <div className="relative mx-auto max-w-6xl min-w-0 px-[max(1rem,env(safe-area-inset-left))] pb-28 pr-[max(1rem,env(safe-area-inset-right))] md:px-10 md:pb-36">
            <div className="relative aspect-[16/9] min-w-0 overflow-hidden sm:aspect-[21/9] md:aspect-[2.4/1]">
              <img
                src={publicUrl("/images/candles/the-house.png")}
                alt="Black Ember house — atmosphere and space"
                className="h-full w-full object-cover object-center opacity-85"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/80" />
              <div className="absolute inset-0 shadow-[inset_0_0_100px_30px_rgba(0,0,0,0.65)]" />
            </div>
            <p className="mt-8 text-balance text-center font-display text-[clamp(1rem,2vw,1.375rem)] italic leading-snug text-stone-600">
              Close enough to touch the wax. Far enough to forget the hour.
            </p>
          </div>
        </section>

        {/* 3 — Scents (products) */}
        <section id="holdings" className="min-w-0 overflow-x-clip border-t border-white/[0.04] bg-charcoal">
          <div className="mx-auto max-w-4xl px-[max(1rem,env(safe-area-inset-left))] pt-24 pr-[max(1rem,env(safe-area-inset-right))] md:px-10 md:pt-32">
            <p className="text-center text-[10px] uppercase tracking-[0.35em] text-stone-600">Our Presence</p>
            <h2 className="mt-6 text-balance text-center font-display text-[clamp(1.75rem,3.5vw,3.25rem)] text-stone-100">
              Scents of the environment
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-pretty text-center text-[clamp(0.8125rem,1.5vw,0.875rem)] font-light leading-relaxed text-stone-500">
              Every scent earns its place.
            </p>
          </div>

          <div className="mx-auto max-w-5xl min-w-0 px-[max(1rem,env(safe-area-inset-left))] pb-28 pr-[max(1rem,env(safe-area-inset-right))] md:px-10 md:pb-36">
            {products.map((product) => (
              <HoldingRow key={product.name} product={product} />
            ))}
          </div>
        </section>

        {/* Quiet proof — one line, not a review grid */}
        <section className="min-w-0 overflow-x-clip border-t border-white/[0.04] bg-midnight py-24 md:py-28">
          <blockquote className="mx-auto max-w-2xl px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] text-center md:px-10">
            <p className="text-balance font-display text-[clamp(1.25rem,2.4vw,1.875rem)] font-normal italic leading-relaxed text-stone-400">
              You do not rise on noise. You rise on return—day after day, the same standard, until the habit outlasts the
              mood that started it.
            </p>
            <footer className="mt-8 text-[10px] uppercase tracking-[0.28em] text-stone-700">— The house</footer>
          </blockquote>
        </section>

        {/* Access — dark, not bright Shopify CTA */}
        <section
          id="access"
          className="min-w-0 overflow-x-clip border-t border-white/[0.04] bg-charcoal px-[max(1rem,env(safe-area-inset-left))] py-24 pr-[max(1rem,env(safe-area-inset-right))] md:px-10 md:py-32"
        >
          <div className="mx-auto max-w-3xl min-w-0 border border-white/[0.08] bg-midnight/80 p-[clamp(1.5rem,4vw,2.5rem)] shadow-[0_0_0_1px_rgba(198,162,74,0.06),0_40px_100px_-40px_rgba(0,0,0,0.9)] md:p-14">
            <p className="text-[10px] uppercase tracking-[0.32em] text-ember-dim">Private list</p>
            <p className="mt-6 text-pretty text-[clamp(0.8125rem,1.5vw,0.875rem)] font-light leading-relaxed text-stone-500">
              Small releases. No loud restocks. Leave an address and we will reach you when there is something worth the
              descent.
            </p>
            <label className="mt-10 block text-[10px] uppercase tracking-[0.22em] text-stone-600" htmlFor="email-access">
              Correspondence
            </label>
            <input
              id="email-access"
              type="email"
              placeholder="you@domain.com"
              autoComplete="email"
              className="mt-3 w-full border border-white/[0.08] bg-charcoal/80 px-4 py-3.5 text-sm text-stone-200 outline-none transition-colors placeholder:text-stone-700 focus:border-ember/30 focus:ring-1 focus:ring-ember/20"
            />
            <Button className="mt-6 w-full md:w-auto">Request invitation</Button>
            <p className="mt-6 text-[11px] leading-relaxed text-stone-700">
              Demo form only—wire to your list tool when you ship the real site.
            </p>
          </div>
        </section>
        </div>
      </main>

      <div className="smoke-bg" aria-hidden>
        <div className="smoke-bg__ambient" />
        <div className="smoke-bg__wisp" />
        <div className="smoke-bg__wisp" />
        <div className="smoke-bg__wisp" />
        <div className="smoke-bg__wisp" />
        <div className="smoke-bg__wisp" />
        <div className="smoke-bg__wisp" />
      </div>

      <footer className="relative z-20 min-w-0 overflow-x-clip border-t border-white/[0.04] bg-midnight">
        <div className="mx-auto flex min-w-0 max-w-6xl flex-col items-center justify-between gap-4 px-[max(1rem,env(safe-area-inset-left))] py-12 pr-[max(1rem,env(safe-area-inset-right))] text-[10px] uppercase tracking-[0.28em] text-stone-700 md:flex-row md:px-10">
          <p className="text-balance text-center md:text-left">© {new Date().getFullYear()} Midnight Ember</p>
          <p className="max-w-md text-balance text-center font-light normal-case tracking-normal text-stone-600 md:text-right">
            Atmosphere first. Identity second. Objects third.
          </p>
        </div>
      </footer>
        </>
      ) : null}
    </div>
  );
}
