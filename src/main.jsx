import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowUp,
  Play,
  Pause,
  Menu,
  X,
  Globe2,
  MoveRight,
  Cpu,
  Layers3,
  Network,
  Check,
  ExternalLink,
  Github,
} from "lucide-react";
import NeuralScene from "./NeuralScene";
import { content } from "./content";
import "./style.css";

function Logo({ small = false, lang = "en" }) {
  return (
    <a
      href="#home"
      className={`brand ${small ? "small" : ""}`}
      aria-label="硅基智宇"
    >
      <img src="/favicon.svg" alt="" width="39" height="39" />
      <span>
        硅基智宇
        <small>
          {lang === "en"
            ? "Brain-inspired intelligence"
            : "类脑智能 · 软硬协同"}
        </small>
      </span>
    </a>
  );
}
function Lines({ text }) {
  return text.split("\n").map((line, i) => (
    <React.Fragment key={line}>
      {i > 0 && <br />}
      {line}
    </React.Fragment>
  ));
}
function External({ href, children, className = "" }) {
  const external = href.startsWith("http");
  return (
    <a
      className={className}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
function MicroArt({ type }) {
  if (type === 0)
    return (
      <svg
        viewBox="0 0 300 160"
        aria-hidden="true"
        className="micro-art signals"
      >
        <path className="signal-base" d="M0 83H300" />
        <path
          className="signal-line"
          d="M5 83H40L48 81L55 83H74L82 32L90 123L98 83H131L139 63L147 103L155 83H188L196 26L204 130L212 83H249L258 60L266 104L274 83H295"
        />
        <circle cx="82" cy="32" r="4" />
        <circle cx="196" cy="26" r="4" />
      </svg>
    );
  if (type === 1)
    return (
      <div className="micro-art chip-art" aria-hidden="true">
        <div className="chip-lines" />
        <div className="chip">
          <div className="chip-grid">
            {Array.from({ length: 25 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  return (
    <div className="micro-art memory-art" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className={`memory-plane plane-${i}`}>
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}
function Architecture({ integrated, c }) {
  return (
    <div className={`architecture ${integrated ? "integrated" : ""}`}>
      <div className="diagram-top">
        <span className="dot" />
        {c.diagramNote}
        <span className="diagram-number">{integrated ? "02" : "01"} / 02</span>
      </div>
      <div className="architecture-stage" aria-hidden="true">
        <div className="arch-grid" />
        <div className="arch-unit memory-unit">
          <Layers3 size={32} />
          <span>{c.memory}</span>
          <div className="unit-pins" />
        </div>
        <div className="signal-bridge">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ "--delay": `${i * -0.55}s` }}>
              <i />
            </div>
          ))}
        </div>
        <div className="arch-unit processor-unit">
          <Cpu size={32} />
          <span>{c.compute}</span>
          <div className="unit-pins" />
        </div>
        <div className="unified-unit">
          <div className="unified-grid">
            {Array.from({ length: 36 }, (_, i) => (
              <span key={i} style={{ "--delay": `${i * -0.17}s` }} />
            ))}
          </div>
          <span>{c.integrated}</span>
        </div>
      </div>
      <p className="diagram-caption">
        <span className="dot" />
        {integrated ? c.integratedLabel : c.dataLabel}
      </p>
    </div>
  );
}
function App() {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("site-language") === "zh" ? "zh" : "en";
    } catch {
      return "en";
    }
  });
  const [menu, setMenu] = useState(false),
    [paused, setPaused] = useState(false),
    [integrated, setIntegrated] = useState(true),
    [research, setResearch] = useState(1);
  const c = content[lang],
    ids = ["approach", "technology", "research", "story"];
  const r = c.research[research];
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.title =
      lang === "zh"
        ? "硅基智宇 — 探索智能的下一种可能"
        : "硅基智宇 — Intelligence, inspired by nature.";
    document
      .querySelector('meta[name="description"]')
      .setAttribute("content", c.heroText);
    try {
      localStorage.setItem("site-language", lang);
    } catch {
      /* Site remains usable when browser storage is disabled. */
    }
  }, [lang, c]);
  useEffect(() => {
    document.documentElement.dataset.motion = paused ? "paused" : "playing";
  }, [paused]);
  useEffect(() => {
    const escape = (e) => {
      if (e.key === "Escape") {
        setMenu(false);
        document.querySelector(".menu-button")?.focus();
      }
    };
    if (menu) document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [menu]);
  const switchResearch = (index) => {
    setResearch(index);
    document
      .getElementById("research")
      .scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  };
  const tabKeys = (e) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const next =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? 2
          : (research + (e.key === "ArrowRight" ? 1 : 2)) % 3;
    setResearch(next);
    document.getElementById(`research-tab-${next}`).focus();
  };
  return (
    <>
      <a href="#main" className="skip-link">
        {c.skip}
      </a>
      <header className="site-header wrap">
        <Logo lang={lang} />
        <nav
          className="desktop-nav"
          aria-label={lang === "en" ? "Main navigation" : "主导航"}
        >
          {c.nav.map((item, i) => (
            <a key={ids[i]} href={`#${ids[i]}`}>
              {item}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="language-button"
            onClick={() => setLang(lang === "en" ? "zh" : "en")}
            aria-label={c.language}
          >
            <Globe2 size={15} />
            <span>{lang === "en" ? "中文" : "EN"}</span>
          </button>
          <a className="nav-contact" href="#contact">
            {c.contact}
            <ArrowUpRight size={15} />
          </a>
          <button
            className="menu-button"
            aria-label={menu ? c.close : c.menu}
            aria-expanded={menu}
            aria-controls="mobile-nav"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
        {menu && (
          <nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label={lang === "en" ? "Mobile navigation" : "移动导航"}
          >
            {c.nav.map((item, i) => (
              <a
                key={ids[i]}
                href={`#${ids[i]}`}
                onClick={() => setMenu(false)}
              >
                {item}
                <ArrowUpRight size={17} />
              </a>
            ))}
            <a href="#contact" onClick={() => setMenu(false)}>
              {c.contact}
              <ArrowUpRight size={17} />
            </a>
          </nav>
        )}
      </header>
      <main id="main">
        <section className="hero wrap" id="home">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="spark" /> {c.heroTag}
            </div>
            <h1>
              {c.heroLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
            <p className="hero-description">{c.heroText}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#technology">
                {c.explore}
                <ArrowUpRight size={18} />
              </a>
              <a
                className="button button-quiet"
                href="#approach"
                aria-label={c.watch}
              >
                <span className="play-icon">
                  <Play size={10} fill="currentColor" />
                </span>
                {c.watch}
              </a>
            </div>
            <p className="hero-footnote">{c.heroCaption}</p>
          </div>
          <div className="hero-art">
            <div className="art-coordinate coord-top">
              <span />
              {lang === "en" ? "Neural connections" : "神经连接"}
            </div>
            <NeuralScene paused={paused} label={c.sculpture} />
            <div className="neural-note glass">
              <span className="note-icon">
                <Network size={22} />
              </span>
              <div>
                <strong>{c.neuralLabel}</strong>
                <p>{c.neuralSub}</p>
              </div>
              <span className="status-dot" />
            </div>
            <div className="art-status">
              <span className="dot" />
              {c.live}
              <button
                className="motion-button"
                aria-label={paused ? c.play : c.pause}
                aria-pressed={paused}
                onClick={() => setPaused(!paused)}
              >
                {paused ? <Play size={12} /> : <Pause size={12} />}
              </button>
            </div>
          </div>
          <div className="hero-bottom">
            <a href="#approach">
              <ArrowDown size={14} />
              {c.scroll}
            </a>
            <span>
              {lang === "en" ? "Algorithms × Silicon" : "算法 × 芯片"}
            </span>
          </div>
        </section>
        <div className="proof-strip wrap">
          <div className="proof-intro">
            <span className="mini-asterisk">✳</span>
            <span>
              {lang === "en" ? (
                <>
                  Inspired by biology.
                  <br />
                  Grounded in research.
                </>
              ) : (
                <>
                  灵感源于生物。
                  <br />
                  根基来自研究。
                </>
              )}
            </span>
          </div>
          {c.stats.map(([number, label], i) => (
            <a
              key={number}
              href={i === 0 ? "#story" : "#research"}
              className="proof-stat"
              onClick={() => i > 0 && setResearch(1)}
            >
              <strong>{number}</strong>
              <span>{label}</span>
            </a>
          ))}
        </div>
        <section id="approach" className="section approach-section wrap">
          <div className="section-intro">
            <div>
              <p className="eyebrow">
                <span className="section-mark" />
                {c.approachLabel}
              </p>
              <h2>
                <Lines text={c.approachTitle} />
              </h2>
            </div>
            <p className="section-description">{c.approachText}</p>
          </div>
          <div className="comparison glass">
            <div className="comparison-visual">
              <div
                className="segmented"
                role="group"
                aria-label={c.compareHint}
              >
                {c.compare.map((name, i) => (
                  <button
                    key={name}
                    aria-pressed={integrated === Boolean(i)}
                    className={integrated === Boolean(i) ? "selected" : ""}
                    onClick={() => setIntegrated(Boolean(i))}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <Architecture integrated={integrated} c={c} />
            </div>
            <div className="comparison-copy" aria-live="polite">
              <span className="comparison-icon">
                {integrated ? <Cpu size={25} /> : <MoveRight size={25} />}
              </span>
              <h3>{integrated ? c.afterTitle : c.beforeTitle}</h3>
              <p>{integrated ? c.afterText : c.beforeText}</p>
              <ul>
                {(integrated ? c.benefit : c.bottlenecks).map((text) => (
                  <li key={text}>
                    <Check size={14} />
                    {text}
                  </li>
                ))}
              </ul>
              <span className="interaction-hint">{c.compareHint}</span>
            </div>
          </div>
        </section>
        <section id="technology" className="section tech-section wrap">
          <div className="section-intro">
            <div>
              <p className="eyebrow">
                <span className="section-mark" />
                {c.techLabel}
              </p>
              <h2>
                <Lines text={c.techTitle} />
              </h2>
            </div>
            <p className="section-description">{c.techText}</p>
          </div>
          <div className="technology-grid">
            {c.techCards.map((card, i) => (
              <article
                className={`technology-card glass tech-${i}`}
                key={card.tag}
              >
                <MicroArt type={i} />
                <div className="technology-content">
                  <span className="card-tag">{card.tag}</span>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  {i === 1 ? (
                    <a
                      href="#approach"
                      onClick={() => setIntegrated(true)}
                      className="text-link"
                    >
                      {card.link}
                      <ArrowUpRight size={16} />
                    </a>
                  ) : (
                    <button
                      className="text-link"
                      onClick={() => switchResearch(i === 0 ? 0 : 2)}
                    >
                      {card.link}
                      <ArrowUpRight size={16} />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
        <section id="research" className="section research-section">
          <div className="wrap">
            <div className="section-intro">
              <div>
                <p className="eyebrow">
                  <span className="section-mark" />
                  {c.researchLabel}
                </p>
                <h2>
                  <Lines text={c.researchTitle} />
                </h2>
              </div>
              <p className="section-description">{c.researchText}</p>
            </div>
            <div
              className="research-tabs"
              role="tablist"
              aria-label={lang === "en" ? "Research models" : "研究模型"}
              onKeyDown={tabKeys}
            >
              {c.researchTabs.map((name, i) => (
                <button
                  key={name}
                  id={`research-tab-${i}`}
                  role="tab"
                  aria-selected={research === i}
                  aria-controls="research-panel"
                  tabIndex={research === i ? 0 : -1}
                  className={research === i ? "active" : ""}
                  onClick={() => setResearch(i)}
                >
                  {name}
                  <span>0{i + 1}</span>
                </button>
              ))}
            </div>
            <div
              id="research-panel"
              className="research-panel"
              role="tabpanel"
              aria-labelledby={`research-tab-${research}`}
              tabIndex={0}
            >
              <div className="research-copy">
                <span className="card-tag">{r.label}</span>
                <h3>{r.title}</h3>
                <p>{r.text}</p>
                <ul>
                  {r.points.map((point) => (
                    <li key={point}>
                      <Check size={15} />
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="research-links">
                  <External href={r.href} className="button button-outline">
                    {r.source}
                    <ArrowUpRight size={15} />
                  </External>
                  {r.second && (
                    <External href={r.secondHref} className="text-link">
                      {r.second}
                      {research === 1 ? (
                        <Github size={16} />
                      ) : (
                        <ExternalLink size={15} />
                      )}
                    </External>
                  )}
                </div>
              </div>
              <div className="research-metric glass">
                <div className="metric-visual" aria-hidden="true">
                  {Array.from({ length: 36 }, (_, i) => (
                    <i
                      key={i}
                      style={{
                        "--bar": `${25 + Math.sin(i * 0.19) * 22 + Math.cos(i * 0.6) * 15}%`,
                        "--delay": `${-i * 0.07}s`,
                      }}
                    />
                  ))}
                </div>
                <div className="metric-content">
                  <strong>{r.metric}</strong>
                  <span>{r.metricLabel}</span>
                </div>
                <p>{r.detail}</p>
              </div>
            </div>
          </div>
        </section>
        <section id="story" className="section story-section wrap">
          <div className="story-copy">
            <p className="eyebrow">
              <span className="section-mark" />
              {c.storyLabel}
            </p>
            <h2>
              <Lines text={c.storyTitle} />
            </h2>
            <p className="story-lead">{c.storyText}</p>
            <p>{c.storyBody}</p>
            <div className="founder-signature">
              <span className="signature-line" />
              <span>
                {lang === "en"
                  ? "From neuroscience to next-generation AI"
                  : "从神经科学，走向下一代人工智能"}
              </span>
            </div>
          </div>
          <div className="journey">
            {c.journey.map(([title, text], i) => (
              <article key={title}>
                <div className="journey-marker">
                  {i === 0 ? (
                    <Network size={19} />
                  ) : i === 1 ? (
                    <Layers3 size={19} />
                  ) : (
                    <Cpu size={19} />
                  )}
                </div>
                <span className="journey-index">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="contact" className="contact-section wrap">
          <div className="contact-glass glass">
            <div className="contact-orbits" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <span className="contact-star" aria-hidden="true">
              ✳
            </span>
            <h2>
              <Lines text={c.vision} />
            </h2>
            <p>{c.visionText}</p>
            <a
              className="button button-primary"
              href="mailto:hello@braingalaxy.ai"
            >
              {c.talk}
              <ArrowUpRight size={18} />
            </a>
            <a className="email-link" href="mailto:hello@braingalaxy.ai">
              {c.email}
            </a>
          </div>
        </section>
      </main>
      <footer className="site-footer wrap">
        <div className="footer-main">
          <div>
            <Logo small lang={lang} />
            <p>{c.footerLine}</p>
          </div>
          <nav aria-label={lang === "en" ? "Footer navigation" : "页脚导航"}>
            <a href="#technology">{c.nav[1]}</a>
            <a href="#story">{c.nav[3]}</a>
            <External href="https://github.com/XYXH-Brain/BILA">
              {c.footerResearch}
              <ArrowUpRight size={13} />
            </External>
          </nav>
          <a className="back-top" href="#home" aria-label={c.back}>
            <ArrowUp size={18} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>{c.copyright}</span>
          <span>
            {lang === "en"
              ? "A more thoughtful kind of computing."
              : "让每一次计算，都更有意义。"}
          </span>
        </div>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
