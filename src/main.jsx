import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDown,
  Bookmark,
  BookmarkPlus,
  CheckCircle2,
  Download,
  ExternalLink,
  Globe2,
  Link as LinkIcon,
  Mail,
  Menu,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import './styles.css';

const FORMSPREE_INQUIRY_ENDPOINT = 'https://formspree.io/f/mppaawgd';
const FORMSPREE_STUDIO_CIRCLE_ENDPOINT = 'https://formspree.io/f/mwleepdn';

const translations = {
  en: {
    language: 'English',
    heroKicker: 'Adesakin Mary Damilola Studio',
    heroTitle: 'Thread Paintings',
    heroTitleAccent: 'for Reflective Collectors',
    heroCopy: 'I create original thread paintings that hold identity, memory, womanhood, justice, and Yoruba heritage in hand-stitched visual narratives for collectors, curators, and quiet spaces of reflection.',
    explore: 'Explore Catalogue',
    collectorList: 'Join Collector List',
    originalWorks: 'Original Works',
    exhibitions: 'Exhibitions',
    threadWorks: 'Thread Works',
    catalogue: 'Collector Catalogue',
    catalogueTitle: 'Original Works & Studio Inquiries',
    searchPlaceholder: 'Search by title, series, material, or year',
    allWorks: 'All Works',
    pricedWorks: 'Priced Works',
    priceOnRequest: 'Price on Request',
    works2026: '2026 Works',
    viewSelect: 'View & Select',
    copyLink: 'Copy artwork link',
    originalPainting: 'Original Painting',
    format: 'Format',
    print: 'Print',
    edition: 'Edition',
    availableByInquiry: 'Available by inquiry',
    sold: 'Sold',
    available: 'Available',
    requestDetails: 'Request Artwork Details',
    unavailable: 'Artwork Unavailable',
    addShortlist: 'Add to Collector Shortlist',
    payDeposit: 'Pay Deposit',
    payInFull: 'Pay in Full',
    stripeMissing: 'Stripe link not added yet. Use inquiry for now.',
    inquirySent: 'Inquiry sent to Mary Adesakin Studio.',
    linkCopied: 'Artwork link copied.',
    artist: 'The Artist',
    statementTitle: 'Artist Statement',
    statement: 'I use thread as both material and metaphor: a line that repairs, remembers, conceals, reveals, and connects what words sometimes cannot carry.',
    about: 'I am a Nigerian thread painter and textile artist from Ile-Ife, Osun State. My work brings thread, canvas, fabric, and pigment together to hold emotion, memory, Yoruba heritage, and contemporary life with care.',
  },
  yo: {
    language: 'Yoruba',
    heroKicker: 'Studio Adesakin Mary Damilola',
    heroTitle: 'Awon Ise Okun',
    heroTitleAccent: 'fun awon akojopo aworan',
    heroCopy: 'Mo n da awon ise aworan okun sile ti o gbe idanimọ, iranti, obinrin, ododo, ati asa Yoruba ninu itan ti a fi owo ran.',
    explore: 'Wo Katalogi',
    collectorList: 'Darapo mo Akojopo',
    originalWorks: 'Awon Ise Atilẹba',
    exhibitions: 'Ifihan',
    threadWorks: 'Ise Okun',
    catalogue: 'Katalogi Akojopo',
    catalogueTitle: 'Awon Ise Atilẹba ati Ibeere Studio',
    searchPlaceholder: 'Wa nipa akole, jara, ohun elo, tabi odun',
    allWorks: 'Gbogbo Ise',
    pricedWorks: 'Ise pelu owo',
    priceOnRequest: 'Owo lori Ibeere',
    works2026: 'Ise 2026',
    viewSelect: 'Wo & Yan',
    copyLink: 'Da link ise ko',
    originalPainting: 'Aworan Atilẹba',
    format: 'Fomati',
    print: 'Print',
    edition: 'Edition',
    availableByInquiry: 'Wa nipa ibeere',
    sold: 'Ti Ta',
    available: 'Wa',
    requestDetails: 'Beere Alaye Ise',
    unavailable: 'Ise yi ko wa',
    addShortlist: 'Fi kun akojopo',
    payDeposit: 'San Deposit',
    payInFull: 'San ni kikun',
    stripeMissing: 'A ko ti fi link Stripe kun. Lo inquiry fun bayi.',
    inquirySent: 'Ibeere ti lo si Mary Adesakin Studio.',
    linkCopied: 'Link ise ti da ko.',
    artist: 'Olorin',
    statementTitle: 'Oro Olorin',
    statement: 'Mo n lo okun gege bi ohun elo ati afiwe: ila ti o tunse, ranti, fi pamọ, fi han, ati so ohun ti oro le ma gbe.',
    about: 'Emi ni olorin okun ati textile lati Ile-Ife, Osun State. Ise mi so okun, canvas, fabric, ati pigment po lati gbe imolara, iranti, asa Yoruba, ati igbesi aye ode oni.',
  },
  fr: {
    language: 'Francais',
    heroKicker: 'Studio Adesakin Mary Damilola',
    heroTitle: 'Peintures au fil',
    heroTitleAccent: 'pour collectionneurs attentifs',
    heroCopy: 'Je cree des peintures originales au fil qui portent identite, memoire, feminite, justice et heritage yoruba dans des recits cousus a la main.',
    explore: 'Explorer le catalogue',
    collectorList: 'Rejoindre la liste',
    originalWorks: 'Oeuvres originales',
    exhibitions: 'Expositions',
    threadWorks: 'Oeuvres au fil',
    catalogue: 'Catalogue collectionneur',
    catalogueTitle: 'Oeuvres originales & demandes au studio',
    searchPlaceholder: 'Rechercher par titre, serie, materiau ou annee',
    allWorks: 'Toutes les oeuvres',
    pricedWorks: 'Oeuvres avec prix',
    priceOnRequest: 'Prix sur demande',
    works2026: 'Oeuvres 2026',
    viewSelect: 'Voir & choisir',
    copyLink: 'Copier le lien',
    originalPainting: 'Peinture originale',
    format: 'Format',
    print: 'Tirage',
    edition: 'Edition',
    availableByInquiry: 'Disponible sur demande',
    sold: 'Vendue',
    available: 'Disponible',
    requestDetails: 'Demander les details',
    unavailable: 'Oeuvre indisponible',
    addShortlist: 'Ajouter a la selection',
    payDeposit: 'Payer un acompte',
    payInFull: 'Payer en totalite',
    stripeMissing: 'Lien Stripe pas encore ajoute. Utilisez la demande pour le moment.',
    inquirySent: 'Demande envoyee au studio Mary Adesakin.',
    linkCopied: 'Lien de l oeuvre copie.',
    artist: "L'artiste",
    statementTitle: "Declaration d'artiste",
    statement: "J'utilise le fil comme matiere et metaphore: une ligne qui repare, se souvient, cache, revele et relie ce que les mots ne portent pas toujours.",
    about: "Je suis artiste textile et peintre au fil originaire d'Ile-Ife, Osun State. Mon travail unit fil, toile, tissu et pigment pour porter emotion, memoire, heritage yoruba et vie contemporaine.",
  },
};

const money = (value) => value ? `$${value.toLocaleString()} USD` : '';
const artworkDescription = (art, lang) => art.description?.[lang] || art.description?.en || '';
const artworkUrl = (art) => `${window.location.origin}${window.location.pathname}#artwork/${art.slug}`;
const normalizePrice = (value) => {
  if (value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
};

function App() {
  const [artworks, setArtworks] = useState([]);
  const [lang, setLang] = useState('en');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [shortlist, setShortlist] = useState([]);
  const [toast, setToast] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminMode, setAdminMode] = useState(() => window.location.hash === '#admin');
  const t = translations[lang];

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/artworks.json`)
      .then((res) => res.json())
      .then(setArtworks)
      .catch(() => setToast('Unable to load artwork data.'));
  }, []);

  useEffect(() => {
    if (!artworks.length) return;
    const openFromHash = () => {
      if (window.location.hash === '#admin') return;
      const slug = decodeURIComponent(window.location.hash || '').replace('#artwork/', '');
      if (!slug) return;
      const art = artworks.find((item) => item.slug === slug);
      if (art) setSelected(art);
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, [artworks]);

  useEffect(() => {
    const handleRoute = () => setAdminMode(window.location.hash === '#admin');
    handleRoute();
    window.addEventListener('hashchange', handleRoute);
    return () => window.removeEventListener('hashchange', handleRoute);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return artworks.filter((art) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'priced' && art.status === 'Available' && art.originalPrice) ||
        (filter === 'request' && art.status !== 'Sold' && !art.originalPrice) ||
        (filter === '2026' && art.year === '2026');
      const haystack = [art.title, art.collection, art.medium, art.year, art.dimensions].join(' ').toLowerCase();
      return matchesFilter && (!needle || haystack.includes(needle));
    });
  }, [artworks, filter, query]);

  const availableCount = artworks.filter((art) => art.status === 'Available').length;
  const soldCount = artworks.filter((art) => art.status === 'Sold').length;

  const showToast = (message) => setToast(message);

  const openArtwork = (art, updateHash = true) => {
    setSelected(art);
    if (updateHash) window.history.replaceState(null, '', `#artwork/${art.slug}`);
  };

  const closeArtwork = () => {
    setSelected(null);
    if (window.location.hash.startsWith('#artwork/')) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
  };

  const copyLink = async (art) => {
    try {
      await navigator.clipboard.writeText(artworkUrl(art));
      showToast(t.linkCopied);
    } catch {
      showToast(artworkUrl(art));
    }
  };

  const addToShortlist = (art) => {
    if (!art.originalPrice || art.status !== 'Available') {
      showToast(t.stripeMissing);
      return;
    }
    if (shortlist.some((item) => item.id === art.id)) {
      showToast(`${art.title} is already shortlisted.`);
      return;
    }
    setShortlist([...shortlist, art]);
    showToast(`${art.title} added.`);
  };

  const handlePaymentLink = (art, type) => {
    const url = type === 'deposit' ? art.stripeDepositUrl : art.stripePaymentUrl;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      showToast(t.stripeMissing);
    }
  };

  return (
    <>
      <header className="topbar">
        <a href="#main" className="brand">
          <img src={`${import.meta.env.BASE_URL}assets/favicon.svg`} alt="Adesakin Mary Studio" />
          <span>Adesakin Mary</span>
        </a>
        <nav className={menuOpen ? 'nav open' : 'nav'}>
          <a href="#artist" onClick={() => setMenuOpen(false)}>{t.artist}</a>
          <a href="#catalogue" onClick={() => setMenuOpen(false)}>{t.originalWorks}</a>
          <a href="#exhibitions" onClick={() => setMenuOpen(false)}>{t.exhibitions}</a>
          <a href="#admin" onClick={() => setMenuOpen(false)}>Admin</a>
        </nav>
        <div className="tools">
          <label className="language">
            <Globe2 size={16} />
            <select value={lang} onChange={(event) => setLang(event.target.value)} aria-label="Select language">
              {Object.entries(translations).map(([code, value]) => (
                <option value={code} key={code}>{value.language}</option>
              ))}
            </select>
          </label>
          <button className="shortlist" type="button" aria-label="Collector shortlist">
            <Bookmark size={16} /> {shortlist.length}
          </button>
          <button className="menu" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open navigation">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main id="main">
        {adminMode ? (
          <AdminPanel artworks={artworks} setArtworks={setArtworks} showToast={showToast} />
        ) : (
          <>
        <section className="hero">
          <div className="hero-copy">
            <span className="kicker"><Sparkles size={16} /> {t.heroKicker}</span>
            <h1>{t.heroTitle} <em>{t.heroTitleAccent}</em></h1>
            <p>{t.heroCopy}</p>
            <div className="actions">
              <a href="#catalogue" className="primary">{t.explore}<ArrowDown size={16} /></a>
              <a href="#newsletter" className="secondary">{t.collectorList}</a>
            </div>
            <div className="metrics">
              <strong>{artworks.length}</strong><span>{t.originalWorks}</span>
              <strong>4</strong><span>{t.exhibitions}</span>
              <strong>{artworks.length}</strong><span>{t.threadWorks}</span>
            </div>
          </div>
          <article className="featured">
            <img src={`${import.meta.env.BASE_URL}assets/artwork/the-weight-of-words.png`} alt="The Weight of Words" />
            <div>
              <span>{t.available}</span>
              <h2>The Weight of Words</h2>
              <p>Thread on Canvas / 30 x 32 inches</p>
              <strong>$750 USD</strong>
            </div>
          </article>
        </section>

        <section id="artist" className="artist">
          <div>
            <span className="kicker">{t.artist}</span>
            <h2>Adesakin Mary Damilola</h2>
            <p>{t.about}</p>
          </div>
          <div className="statement">
            <span className="kicker">{t.statementTitle}</span>
            <p>{t.statement}</p>
          </div>
        </section>

        <section id="catalogue" className="catalogue">
          <div className="section-head">
            <div>
              <span className="kicker">{t.catalogue}</span>
              <h2>{t.catalogueTitle}</h2>
            </div>
            <div className="filters">
              {[
                ['all', t.allWorks],
                ['priced', t.pricedWorks],
                ['request', t.priceOnRequest],
                ['2026', t.works2026],
              ].map(([value, label]) => (
                <button className={filter === value ? 'active' : ''} type="button" onClick={() => setFilter(value)} key={value}>{label}</button>
              ))}
            </div>
          </div>
          <label className="search">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchPlaceholder} />
          </label>
          <div className="trust-row">
            <p><ShieldCheck size={16} /> Studio-confirmed originals before payment.</p>
            <p><CheckCircle2 size={16} /> {availableCount} available, {soldCount} in private collections.</p>
          </div>
          <div className="grid">
            {filtered.map((art) => (
              <article className="art-card" key={art.id}>
                <img src={`${import.meta.env.BASE_URL}${art.image}`} alt={art.title} loading="lazy" />
                <div className="art-body">
                  <div className="art-meta">
                    <span>{art.collection}</span>
                    <span className={art.status === 'Sold' ? 'sold' : 'available'}>{art.status === 'Sold' ? t.sold : t.available}</span>
                  </div>
                  <h3>{art.title}</h3>
                  <p className="spec">{art.medium} / {art.dimensions}</p>
                  <p>{artworkDescription(art, lang)}</p>
                  <dl>
                    <dt>{t.originalPainting}</dt>
                    <dd>{art.status === 'Sold' ? t.sold : art.originalPrice ? money(art.originalPrice) : t.priceOnRequest}</dd>
                    <dt>{t.format}</dt>
                    <dd>Original + Print</dd>
                    <dt>{t.print}</dt>
                    <dd>{art.printPrice ? money(art.printPrice) : t.availableByInquiry}</dd>
                  </dl>
                  <div className="card-actions">
                    <button type="button" onClick={() => openArtwork(art)}>{t.viewSelect}</button>
                    <button type="button" aria-label={t.copyLink} onClick={() => copyLink(art)}><LinkIcon size={16} /></button>
                    {art.originalPrice ? <button type="button" aria-label={t.addShortlist} onClick={() => addToShortlist(art)}><BookmarkPlus size={16} /></button> : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="newsletter" className="contact-band">
          <h2>{t.collectorList}</h2>
          <form action={FORMSPREE_STUDIO_CIRCLE_ENDPOINT} method="POST">
            <input type="email" name="email" placeholder="Email Address" required />
            <button type="submit"><Send size={16} /> {t.collectorList}</button>
          </form>
        </section>

        <section id="exhibitions" className="exhibitions">
          <span className="kicker">{t.exhibitions}</span>
          <h2>Exhibitions & Press</h2>
          <ul>
            <li>La Beaute Vue par les Artistes, Paris, 2025</li>
            <li>House of George Art and Craft Gallery, 2025</li>
            <li>Deep in Thought, Annual Contemporary Art Showcase, 2024</li>
            <li>Life In My City Art Festival, 2024</li>
          </ul>
        </section>
          </>
        )}
      </main>

      <footer>
        <div>
          <strong>Adesakin Mary Studio</strong>
          <p>adesakinmary2020@gmail.com / +234 906 700 2871</p>
          <p>Ile-Ife, Osun State, Nigeria</p>
        </div>
        <div className="footer-links">
          <div className="socials">
            <a href="mailto:adesakinmary2020@gmail.com" aria-label="Email Mary"><Mail size={18} /></a>
            <a href="https://www.instagram.com/adesakinmarydamilola?igsh=anRnODJ6bTRod21h&utm_source=qr" target="_blank" rel="noreferrer" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a>
            <a href="https://www.tiktok.com/@dammy017?_r=1&_t=ZS-98aw9mfksiq" target="_blank" rel="noreferrer" aria-label="TikTok"><i className="fa-brands fa-tiktok" /></a>
            <a href="https://www.facebook.com/share/1DzBXHzfPN/?mibextid=wwXIfr" target="_blank" rel="noreferrer" aria-label="Facebook"><i className="fa-brands fa-facebook-f" /></a>
          </div>
          <small>Built with love ❤️</small>
        </div>
      </footer>

      {selected ? (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="artwork-title">
          <div className="modal-panel">
            <button type="button" className="close" onClick={closeArtwork} aria-label="Close artwork details"><X /></button>
            <img src={`${import.meta.env.BASE_URL}${selected.image}`} alt={selected.title} />
            <div className="modal-copy">
              <span className={selected.status === 'Sold' ? 'sold badge' : 'available badge'}>{selected.status === 'Sold' ? t.sold : t.available}</span>
              <h2 id="artwork-title">{selected.title}</h2>
              <p className="spec">{selected.medium} / {selected.dimensions}</p>
              <p>{artworkDescription(selected, lang)}</p>
              <dl>
                <dt>Year</dt><dd>{selected.year}</dd>
                <dt>{t.originalPainting}</dt><dd>{selected.status === 'Sold' ? t.sold : selected.originalPrice ? money(selected.originalPrice) : t.priceOnRequest}</dd>
                <dt>{t.print}</dt><dd>{selected.printPrice ? money(selected.printPrice) : t.availableByInquiry}</dd>
                <dt>{t.edition}</dt><dd>{selected.edition}</dd>
                <dt>Provenance</dt><dd>{selected.provenance}</dd>
              </dl>
              <div className="modal-actions">
                <button type="button" onClick={() => copyLink(selected)}><LinkIcon size={16} /> {t.copyLink}</button>
                <button type="button" onClick={() => handlePaymentLink(selected, 'deposit')}><ExternalLink size={16} /> {t.payDeposit}</button>
                <button type="button" onClick={() => handlePaymentLink(selected, 'full')}><ExternalLink size={16} /> {t.payInFull}</button>
                <a href={`mailto:adesakinmary2020@gmail.com?subject=Artwork inquiry: ${encodeURIComponent(selected.title)}`}>{t.requestDetails}</a>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? <div className="toast">{toast}</div> : null}
    </>
  );
}

function AdminPanel({ artworks, setArtworks, showToast }) {
  const pricedOriginals = artworks.filter((art) => art.originalPrice).length;
  const pricedPrints = artworks.filter((art) => art.printPrice).length;

  const updatePrice = (id, field, value) => {
    setArtworks((items) => items.map((art) => (
      art.id === id ? { ...art, [field]: normalizePrice(value) } : art
    )));
  };

  const exportJson = () => {
    const json = JSON.stringify(artworks, null, 2);
    const blob = new Blob([`${json}\n`], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'artworks.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast('Updated artworks.json downloaded.');
  };

  return (
    <section id="admin" className="admin-panel">
      <div className="admin-head">
        <div>
          <span className="kicker"><Settings size={16} /> Catalogue Admin</span>
          <h1>Artwork Pricing Editor</h1>
          <p>Edit original artwork prices and print prices, then export the updated JSON for the site catalogue.</p>
        </div>
        <button type="button" className="primary admin-download" onClick={exportJson}>
          <Download size={16} /> Export JSON
        </button>
      </div>

      <div className="admin-summary">
        <p><strong>{artworks.length}</strong><span>Total works</span></p>
        <p><strong>{pricedOriginals}</strong><span>Original prices</span></p>
        <p><strong>{pricedPrints}</strong><span>Print prices</span></p>
      </div>

      <div className="admin-note">
        <strong>How to publish price edits:</strong>
        <span>Export the JSON, replace <code>public/data/artworks.json</code> with the download, then commit and push.</span>
      </div>

      <div className="admin-table" aria-label="Artwork price editor">
        {artworks.map((art) => (
          <article className="admin-row" key={art.id}>
            <img src={`${import.meta.env.BASE_URL}${art.image}`} alt={art.title} loading="lazy" />
            <div className="admin-artwork">
              <span className={art.status === 'Sold' ? 'sold badge' : 'available badge'}>{art.status}</span>
              <h2>{art.title}</h2>
              <p>{art.medium} / {art.dimensions} / {art.year}</p>
            </div>
            <label className="admin-field">
              <span>Original price</span>
              <input
                type="number"
                min="0"
                step="1"
                value={art.originalPrice ?? ''}
                onChange={(event) => updatePrice(art.id, 'originalPrice', event.target.value)}
                placeholder="Price on request"
              />
            </label>
            <label className="admin-field">
              <span>Print price</span>
              <input
                type="number"
                min="0"
                step="1"
                value={art.printPrice ?? ''}
                onChange={(event) => updatePrice(art.id, 'printPrice', event.target.value)}
                placeholder="Available by inquiry"
              />
            </label>
          </article>
        ))}
      </div>
    </section>
  );
}

createRoot(document.getElementById('root')).render(<App />);
