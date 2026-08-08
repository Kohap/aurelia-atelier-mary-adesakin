import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDown,
  Bookmark,
  BookmarkPlus,
  CheckCircle2,
  CreditCard,
  Download,
  ExternalLink,
  Globe2,
  ImagePlus,
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
import {
  artworkForHash,
  hasPaymentLink,
  hasPrintPaymentLink,
  hasPrintPricing,
  isAdminPath,
  isPaystackPaymentUrl,
  isPositivePrice,
  matchesCatalogueFilter,
  money,
  nextArtworkId,
  normalizePrice,
  paymentUrlFor,
  printPaymentUrlFor,
  printOptionsFor,
  uniqueArtworkSlug,
} from './app-utils.js';

const FORMSPREE_INQUIRY_ENDPOINT = 'https://formspree.io/f/mppaawgd';
const FORMSPREE_STUDIO_CIRCLE_ENDPOINT = 'https://formspree.io/f/mwleepdn';
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ?? '';
const PAYSTACK_CURRENCY = import.meta.env.VITE_PAYSTACK_CURRENCY ?? 'NGN';
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN ?? '';
const MAX_ARTWORK_IMAGE_BYTES = 15 * 1024 * 1024;

let _fxPromise = null;
const fetchNgnPerUsd = () => {
  if (_fxPromise) return _fxPromise;
  _fxPromise = fetch('https://open.er-api.com/v6/latest/USD')
    .then((res) => {
      if (!res.ok) throw new Error('Could not load today\'s exchange rate. Please try again.');
      return res.json();
    })
    .then(({ rates }) => {
      const rate = rates?.NGN;
      if (typeof rate !== 'number' || !Number.isFinite(rate) || rate <= 0) {
        throw new Error('Exchange rate data is unavailable. Please try again.');
      }
      return rate;
    })
    .catch((err) => {
      _fxPromise = null;
      throw err;
    });
  return _fxPromise;
};
const ALLOWED_ARTWORK_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const emptyArtworkDraft = () => ({
  title: '',
  collection: '',
  year: String(new Date().getFullYear()),
  medium: '',
  dimensions: '',
  originalPrice: '',
  status: 'Available',
  edition: 'Original work',
  provenance: 'Original catalogue work by Mary Adesakin Damilola.',
  description: '',
  printSize: '',
  printPrice: '',
  paystackPaymentUrl: '',
  printPaystackUrl: '',
});

const loadArtworkImage = async (file) => {
  if (typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(file);
    return {
      source: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      release: () => bitmap.close(),
    };
  }

  const sourceUrl = URL.createObjectURL(file);
  const image = new Image();
  image.src = sourceUrl;
  await image.decode();
  return {
    source: image,
    width: image.naturalWidth,
    height: image.naturalHeight,
    release: () => URL.revokeObjectURL(sourceUrl),
  };
};

const optimizeArtworkUpload = async (file, slug) => {
  if (!ALLOWED_ARTWORK_IMAGE_TYPES.has(file.type)) {
    throw new Error('Choose a JPG, PNG, or WebP image.');
  }
  if (file.size > MAX_ARTWORK_IMAGE_BYTES) {
    throw new Error('The image must be 15 MB or smaller.');
  }

  const image = await loadArtworkImage(file);
  const scale = Math.min(1, 1400 / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext('2d');
  if (!context) {
    image.release();
    throw new Error('This browser could not prepare the image.');
  }
  context.drawImage(image.source, 0, 0, canvas.width, canvas.height);
  image.release();

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.78));
  if (!blob) throw new Error('This browser could not prepare the image.');

  return { blob, filename: `${slug}.webp` };
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const policies = {
  terms: {
    title: 'Studio Terms',
    content: [
      'Artwork, prices, and availability shown on this website are for general information. A shortlist or inquiry does not reserve an artwork or create a sale.',
      'Before payment, the studio confirms the work, final price, availability, shipping destination, delivery timing, and payment instructions in writing. Prices exclude shipping, customs duties, and import taxes unless confirmed otherwise.',
      'Shipping arrangements will begin seven days after payment has been completed. A certificate of authenticity will be issued and shipped with the artwork.',
      'Artwork images aim to represent each piece faithfully, but colour, texture, and scale can differ across screens. Copyright in the artwork, images, and text remains with Mary Adesakin unless agreed otherwise in writing.',
    ],
  },
  returns: {
    title: 'Return & Refund Policy',
    content: [
      'Original artworks and made-to-order commissions are final sale after payment is confirmed because each work is unique or made specifically for its collector.',
      'If a work arrives damaged, contact the studio within 48 hours with order details and photographs of the packaging and damage. Keep all packaging until the studio responds.',
      'The studio will review delivery damage and agree an appropriate remedy. Commission cancellations and deposit terms are governed by the written commission agreement.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    content: [
      'The studio uses the contact details and messages you submit only to answer inquiries, prepare acquisition or shipping information, fulfil agreed work, and maintain studio records.',
      'Forms are processed by Formspree. The website uses Plausible Analytics for aggregate traffic measurement and does not process or store payment-card details. Do not send financial credentials through an inquiry form.',
      'The studio does not sell personal information. To request access, correction, or deletion, email adesakinmary2020@gmail.com. External social and payment services apply their own privacy policies.',
    ],
  },
};

const translations = {
  en: {
    language: 'English',
    heroKicker: 'Adesakin Mary Damilola Studio',
    heroTitle: 'Thread Paintings',
    heroTitleAccent: 'for Reflective Collectors',
    heroCopy: 'I create original thread paintings that hold identity, memory, womanhood, and Yoruba heritage in hand-stitched visual narratives for collectors, curators, and quiet spaces of reflection.',
    explore: 'Explore Catalogue',
    collectorList: 'Join Collector List',
    originalWorks: 'Original Works',
    printWorks: 'Print',
    exhibitions: 'Exhibitions',
    threadWorks: 'Thread Works',
    catalogue: 'Collector Catalogue',
    catalogueTitle: 'Original Works & Studio Inquiries',
    searchPlaceholder: 'Search by title, series, material, or year',
    allWorks: 'Original Works',
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
    payInFull: 'Pay in Full',
    buyPrint: 'Buy Print',
    inquirySent: 'Inquiry sent to Mary Adesakin Studio.',
    linkCopied: 'Artwork link copied.',
    artist: 'The Artist Bio',
    statementTitle: 'Artist Statement',
    statement: 'My practice explores themes of vulnerability, struggle, culture, and resilience through textile based portraiture using thread and acrylic. I use thread as both a material and a language to connect fragments of memory, identity, and lived experience while exploring personal narratives and broader societal issues.',
    about: [
      'Adesakin Mary Damilola is a Nigerian visual artist from Ile-Ife, whose practice focuses on thread painting and acrylic. Born in the early 2000s, she explores themes of vulnerability, struggle, culture, and resilience through layered compositions, using thread as both a material and a language to connect memory, identity, and lived experience.',
      'She studied Fine and Applied Arts at Adeyemi College of Education (affiliated to Obafemi Awolowo University) and graduated in 2024. Currently working as a full time artist, her work has been exhibited in Nigeria and internationally, including Deep in Thought Art Exhibition, La Beauté Vue par les Artistes in Paris, and the SWANS Female Exhibition. She has also exhibited with Tola Wewe Art Gallery, and her works are held by private collectors.',
    ],
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
    printWorks: 'Print',
    exhibitions: 'Ifihan',
    threadWorks: 'Ise Okun',
    catalogue: 'Katalogi Akojopo',
    catalogueTitle: 'Awon Ise Atilẹba ati Ibeere Studio',
    searchPlaceholder: 'Wa nipa akole, jara, ohun elo, tabi odun',
    allWorks: 'Awon Ise Atilẹba',
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
    payInFull: 'San ni kikun',
    buyPrint: 'Ra Print',
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
    heroCopy: 'Je cree des peintures originales au fil qui portent identite, memoire, feminite et heritage yoruba dans des recits cousus a la main.',
    explore: 'Explorer le catalogue',
    collectorList: 'Rejoindre la liste',
    originalWorks: 'Oeuvres originales',
    printWorks: 'Tirage',
    exhibitions: 'Expositions',
    threadWorks: 'Oeuvres au fil',
    catalogue: 'Catalogue collectionneur',
    catalogueTitle: 'Oeuvres originales & demandes au studio',
    searchPlaceholder: 'Rechercher par titre, serie, materiau ou annee',
    allWorks: 'Oeuvres originales',
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
    payInFull: 'Payer en totalite',
    buyPrint: 'Acheter le tirage',
    inquirySent: 'Demande envoyee au studio Mary Adesakin.',
    linkCopied: 'Lien de l oeuvre copie.',
    artist: "L'artiste",
    statementTitle: "Declaration d'artiste",
    statement: "J'utilise le fil comme matiere et metaphore: une ligne qui repare, se souvient, cache, revele et relie ce que les mots ne portent pas toujours.",
    about: "Je suis artiste textile et peintre au fil originaire d'Ile-Ife, Osun State. Mon travail unit fil, toile, tissu et pigment pour porter emotion, memoire, heritage yoruba et vie contemporaine.",
  },
};

const artworkDescription = (art, lang) => art.description?.[lang] || art.description?.en || '';
const artworkUrl = (art) => `${window.location.origin}${window.location.pathname}#artwork/${art.slug}`;

function App() {
  const [artworks, setArtworks] = useState([]);
  const [lang, setLang] = useState('en');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [shortlist, setShortlist] = useState([]);
  const [shortlistOpen, setShortlistOpen] = useState(false);
  const [inquiryArtwork, setInquiryArtwork] = useState(null);
  const [policyName, setPolicyName] = useState(null);
  const [toast, setToast] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [checkoutTarget, setCheckoutTarget] = useState(null);
  const adminMode = isAdminPath(window.location.pathname);
  const t = translations[lang];
  const featuredArt = artworks.find((art) => art.slug === 'the-weight-of-words');

  useEffect(() => {
    const load = async () => {
      try {
        const blobRes = await fetch('/api/catalogue');
        if (blobRes.ok) return blobRes.json();
      } catch { /* fall through to bundled static file */ }
      const staticRes = await fetch(`${import.meta.env.BASE_URL}data/artworks.json`);
      return staticRes.json();
    };
    load().then(setArtworks).catch(() => setToast('Unable to load artwork data.'));
  }, []);

  useEffect(() => {
    if (!artworks.length) return;
    const openFromHash = () => {
      setSelected(artworkForHash(artworks, window.location.hash || ''));
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, [artworks]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return artworks.filter((art) => {
      const haystack = [art.title, art.collection, art.medium, art.year, art.dimensions].join(' ').toLowerCase();
      return matchesCatalogueFilter(art, filter) && (!needle || haystack.includes(needle));
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

  const openCheckout = (artwork, amount, label) => {
    setCheckoutTarget({ artwork, amount, label });
    closeArtwork();
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
    if (art.status !== 'Available') {
      showToast(t.unavailable);
      return;
    }
    if (shortlist.some((item) => item.id === art.id)) {
      showToast(`${art.title} is already shortlisted.`);
      return;
    }
    setShortlist((items) => [...items, art]);
    showToast(`${art.title} added.`);
  };

  const removeFromShortlist = (id) => {
    setShortlist((items) => items.filter((item) => item.id !== id));
  };

  return (
    <>
      <header className="topbar">
        <a href={adminMode ? import.meta.env.BASE_URL : '#main'} className="brand">
          <img src={`${import.meta.env.BASE_URL}assets/favicon.svg`} alt="Adesakin Mary Studio" />
          <span>Adesakin Mary</span>
        </a>
        <nav className={menuOpen ? 'nav open' : 'nav'}>
          {adminMode ? (
            <a href={import.meta.env.BASE_URL}>View public site</a>
          ) : (
            <>
              <a href="#artist" onClick={() => setMenuOpen(false)}>{t.artist}</a>
              <a href="#catalogue" onClick={() => { setFilter('all'); setMenuOpen(false); }}>{t.originalWorks}</a>
              <a href="#catalogue" onClick={() => { setFilter('prints'); setMenuOpen(false); }}>{t.printWorks}</a>
              <a href="#exhibitions" onClick={() => setMenuOpen(false)}>{t.exhibitions}</a>
            </>
          )}
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
          <button className="shortlist" type="button" aria-label={`Collector shortlist, ${shortlist.length} items`} onClick={() => setShortlistOpen(true)}>
            <Bookmark size={16} /> {shortlist.length}
          </button>
          <button
            className="menu"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
          >
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
            <p className="hero-trust"><ShieldCheck size={16} /> Original works, studio-confirmed availability, and print options handled by inquiry or secure checkout.</p>
            <div className="metrics">
              <strong>{artworks.length}</strong><span>{t.originalWorks}</span>
              <strong>4</strong><span>{t.exhibitions}</span>
              <strong>{artworks.length}</strong><span>{t.threadWorks}</span>
            </div>
          </div>
          <article className="featured">
            <img
              src={`${import.meta.env.BASE_URL}${featuredArt?.image || 'assets/artwork/the-weight-of-words.webp'}`}
              alt={featuredArt?.title || 'The Weight of Words'}
              fetchPriority="high"
              decoding="async"
            />
            <div>
              <span>{featuredArt?.status === 'Sold' ? t.sold : t.available}</span>
              <h2>{featuredArt?.title || 'The Weight of Words'}</h2>
              <p>{featuredArt ? `${featuredArt.medium} / ${featuredArt.dimensions}` : 'Thread on Canvas / 30 x 32 inches'}</p>
              <strong>{featuredArt ? (money(featuredArt.originalPrice) || t.priceOnRequest) : 'Loading catalogue…'}</strong>
              {featuredArt ? <button type="button" onClick={() => openArtwork(featuredArt)}>View Featured Work</button> : null}
            </div>
          </article>
        </section>

        <section id="artist" className="artist">
          <div>
            <span className="kicker">{t.artist}</span>
            <h2>Adesakin Mary Damilola</h2>
            {Array.isArray(t.about)
              ? t.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
              : <p>{t.about}</p>}
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
                ['prints', t.printWorks],
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
            <p><ShieldCheck size={16} /> Terms, returns, privacy, and shipping timing are available before purchase.</p>
          </div>
          <div className="grid">
            {filtered.map((art) => (
              <article className="art-card" key={art.id}>
                <img src={`${import.meta.env.BASE_URL}${art.image}`} alt={art.title} loading="lazy" decoding="async" />
                <div className="art-body">
                  <div className="art-meta">
                    <span>{art.collection}</span>
                  </div>
                  <div className="art-badges">
                    <span className={art.status === 'Sold' ? 'sold badge' : 'available badge'}>{art.status === 'Sold' ? t.sold : t.available}</span>
                    {hasPrintPricing(art) ? <PrintBadge /> : null}
                  </div>
                  <h3>{art.title}</h3>
                  <p className="spec">{art.medium} / {art.dimensions}</p>
                  <p className="card-description">{artworkDescription(art, lang)}</p>
                  <div className="price-line">
                    <span>{filter === 'prints' ? t.print : t.originalPainting}</span>
                    <strong>
                      {filter === 'prints'
                        ? printOptionsFor(art)[0] ? money(printOptionsFor(art)[0].price) : t.availableByInquiry
                        : art.status === 'Sold' ? t.sold : isPositivePrice(art.originalPrice) ? money(art.originalPrice) : t.priceOnRequest}
                    </strong>
                  </div>
                  <dl>
                    {filter === 'prints' ? (
                      <>
                        <dt>{t.print}</dt>
                        <dd><PrintPricing artwork={art} fallback={t.availableByInquiry} /></dd>
                        <dt>{t.format}</dt>
                        <dd>{t.printWorks}</dd>
                      </>
                    ) : (
                      <>
                        <dt>{t.originalPainting}</dt>
                        <dd>{art.status === 'Sold' ? t.sold : isPositivePrice(art.originalPrice) ? money(art.originalPrice) : t.priceOnRequest}</dd>
                        <dt>{t.format}</dt>
                        <dd>{t.originalPainting}</dd>
                      </>
                    )}
                  </dl>
                  <div className="card-actions">
                    <button type="button" onClick={() => openArtwork(art)}>{t.viewSelect}</button>
                    <button type="button" aria-label={t.copyLink} onClick={() => copyLink(art)}><LinkIcon size={16} /></button>
                    {art.status === 'Available' ? <button type="button" aria-label={t.addShortlist} onClick={() => addToShortlist(art)}><BookmarkPlus size={16} /></button> : null}
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
            <li>SWANS Female Exhibition, Signature Beyond Art Gallery, Lagos, 2026</li>
            <li>La Beaute Vue par les Artistes, Paris, 2025</li>
            <li>Tola Wewe Art Gallery, Ondo, 2025</li>
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
          <div className="policy-links" aria-label="Studio policies">
            <button type="button" onClick={() => setPolicyName('terms')}>Terms</button>
            <button type="button" onClick={() => setPolicyName('returns')}>Returns & Refunds</button>
            <button type="button" onClick={() => setPolicyName('privacy')}>Privacy</button>
          </div>
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
        <Dialog labelledBy="artwork-title" onClose={closeArtwork}>
          <div className="modal-panel artwork-modal-panel">
            <button type="button" className="close" onClick={closeArtwork} aria-label="Close artwork details"><X /></button>
            <img src={`${import.meta.env.BASE_URL}${selected.image}`} alt={selected.title} decoding="async" />
            <div className="modal-copy">
              <span className={selected.status === 'Sold' ? 'sold badge' : 'available badge'}>{selected.status === 'Sold' ? t.sold : t.available}</span>
              <h2 id="artwork-title">{selected.title}</h2>
              <p className="spec">{selected.medium} / {selected.dimensions}</p>
              <p>{artworkDescription(selected, lang)}</p>
              <dl>
                <dt>Year</dt><dd>{selected.year}</dd>
                <dt>{t.originalPainting}</dt><dd>{selected.status === 'Sold' ? t.sold : isPositivePrice(selected.originalPrice) ? money(selected.originalPrice) : t.priceOnRequest}</dd>
                <dt>{t.print}</dt><dd><PrintPricing artwork={selected} fallback={t.availableByInquiry} buyLabel={t.buyPrint} onBuy={PAYSTACK_PUBLIC_KEY ? (option) => openCheckout(selected, option.price, `Print ${option.size}`) : null} /></dd>
                <dt>{t.edition}</dt><dd>{selected.edition}</dd>
                <dt>Provenance</dt><dd>{selected.provenance}</dd>
              </dl>
              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-primary-action"
                  onClick={() => {
                    setInquiryArtwork(selected);
                    closeArtwork();
                  }}
                >
                  <Mail size={16} /> Request Availability
                </button>
                {PAYSTACK_PUBLIC_KEY && selected.status === 'Available' && isPositivePrice(selected.originalPrice) ? (
                  <button type="button" onClick={() => openCheckout(selected, selected.originalPrice, 'Full price')}><CreditCard size={16} /> {t.payInFull}</button>
                ) : (
                  hasPaymentLink(selected, 'full') ? <a href={paymentUrlFor(selected, 'full')} target="_blank" rel="noreferrer"><ExternalLink size={16} /> {t.payInFull}</a> : null
                )}
                {selected.status === 'Available' ? <button type="button" onClick={() => addToShortlist(selected)}><BookmarkPlus size={16} /> {t.addShortlist}</button> : null}
                <button type="button" onClick={() => copyLink(selected)}><LinkIcon size={16} /> {t.copyLink}</button>
              </div>
            </div>
          </div>
        </Dialog>
      ) : null}

      {inquiryArtwork ? (
        <ArtworkInquiryDialog
          artwork={inquiryArtwork}
          onClose={() => setInquiryArtwork(null)}
          onSent={() => {
            setInquiryArtwork(null);
            showToast(t.inquirySent);
          }}
          onOpenPrivacy={() => {
            setInquiryArtwork(null);
            setPolicyName('privacy');
          }}
        />
      ) : null}

      {shortlistOpen ? (
        <ShortlistDialog
          items={shortlist}
          onClose={() => setShortlistOpen(false)}
          onRemove={removeFromShortlist}
          onOpenPrivacy={() => {
            setShortlistOpen(false);
            setPolicyName('privacy');
          }}
        />
      ) : null}

      {policyName ? (
        <PolicyDialog policy={policies[policyName]} onClose={() => setPolicyName(null)} />
      ) : null}

      {checkoutTarget ? (
        <CheckoutDialog
          artwork={checkoutTarget.artwork}
          amount={checkoutTarget.amount}
          label={checkoutTarget.label}
          onClose={() => setCheckoutTarget(null)}
          showToast={showToast}
        />
      ) : null}

      {toast ? <div className="toast" role="status" aria-live="polite">{toast}</div> : null}
    </>
  );
}

function Dialog({ labelledBy, onClose, children }) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    document.body.style.overflow = 'hidden';
    const firstFocusable = dialog?.querySelector(focusableSelector);
    (firstFocusable || dialog)?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab' || !dialog) return;
      const focusable = [...dialog.querySelectorAll(focusableSelector)];
      if (!focusable.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, []);

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      ref={dialogRef}
      tabIndex="-1"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {children}
    </div>
  );
}

function ShortlistDialog({ items, onClose, onRemove, onOpenPrivacy }) {
  const selectedWorks = items.map((art) => (
    `${art.title} (${isPositivePrice(art.originalPrice) ? money(art.originalPrice) : 'Price on request'})`
  )).join('; ');

  return (
    <Dialog labelledBy="shortlist-title" onClose={onClose}>
      <div className="modal-panel compact-modal">
        <button type="button" className="close" onClick={onClose} aria-label="Close collector shortlist"><X /></button>
        <div className="modal-copy shortlist-copy">
          <span className="kicker">Collector Inquiry</span>
          <h2 id="shortlist-title">Collector Shortlist</h2>
          {items.length ? (
            <ul className="shortlist-items">
              {items.map((art) => (
                <li key={art.id}>
                  <img src={`${import.meta.env.BASE_URL}${art.image}`} alt="" loading="lazy" decoding="async" />
                  <span><strong>{art.title}</strong><small>{money(art.originalPrice) || 'Price on request'}</small></span>
                  <button type="button" onClick={() => onRemove(art.id)} aria-label={`Remove ${art.title} from shortlist`}><X size={16} /></button>
                </li>
              ))}
            </ul>
          ) : <p>Your shortlist is empty. Add an available artwork from the catalogue.</p>}

          <form className="inquiry-form" action={FORMSPREE_INQUIRY_ENDPOINT} method="POST">
            <input type="hidden" name="_subject" value="Collector acquisition inquiry" />
            <input type="hidden" name="shortlisted_artworks" value={selectedWorks} />
            <label>
              <span>Name</span>
              <input type="text" name="name" autoComplete="name" maxLength="100" required />
            </label>
            <label>
              <span>Email</span>
              <input type="email" name="email" autoComplete="email" maxLength="254" required />
            </label>
            <label>
              <span>Location</span>
              <input type="text" name="location" autoComplete="country-name" maxLength="120" required />
            </label>
            <label>
              <span>Message</span>
              <textarea name="message" rows="4" maxLength="2000" placeholder="Ask about availability, shipping, or acquisition details." />
            </label>
            <p className="form-privacy">Form details are used to respond to this inquiry. <button type="button" onClick={onOpenPrivacy}>Read the privacy policy.</button></p>
            <button className="primary" type="submit" disabled={!items.length}><Send size={16} /> Send Inquiry</button>
          </form>
        </div>
      </div>
    </Dialog>
  );
}

function ArtworkInquiryDialog({ artwork, onClose, onSent, onOpenPrivacy }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submitInquiry = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(FORMSPREE_INQUIRY_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error('Inquiry submission failed');
      onSent();
    } catch {
      setError('Your inquiry could not be sent. Please try again or email adesakinmary2020@gmail.com.');
      setSubmitting(false);
    }
  };

  return (
    <Dialog labelledBy="artwork-inquiry-title" onClose={onClose}>
      <div className="modal-panel compact-modal">
        <button type="button" className="close" onClick={onClose} aria-label="Close artwork inquiry"><X /></button>
        <div className="modal-copy shortlist-copy">
          <span className="kicker">Artwork Inquiry</span>
          <h2 id="artwork-inquiry-title">Ask About {artwork.title}</h2>
          <p>Send your question directly to Mary Adesakin Studio. The artwork details will be included automatically.</p>

          <form className="inquiry-form" onSubmit={submitInquiry}>
            <input type="hidden" name="_subject" value={`Artwork inquiry: ${artwork.title}`} />
            <input type="hidden" name="artwork" value={artwork.title} />
            <input type="hidden" name="artwork_url" value={artworkUrl(artwork)} />
            <input type="hidden" name="original_price" value={money(artwork.originalPrice) || 'Price on request'} />
            <input className="form-honeypot" type="text" name="_gotcha" tabIndex="-1" autoComplete="off" aria-hidden="true" />
            <label>
              <span>Name</span>
              <input type="text" name="name" autoComplete="name" maxLength="100" required />
            </label>
            <label>
              <span>Email</span>
              <input type="email" name="email" autoComplete="email" maxLength="254" required />
            </label>
            <label>
              <span>Location</span>
              <input type="text" name="location" autoComplete="country-name" maxLength="120" required />
            </label>
            <label>
              <span>Message</span>
              <textarea name="message" rows="5" maxLength="2000" placeholder="Ask about availability, prints, payment, or shipping." required />
            </label>
            <p className="form-privacy">Form details are used to respond to this inquiry. <button type="button" onClick={onOpenPrivacy}>Read the privacy policy.</button></p>
            {error ? <p className="form-error" role="alert">{error}</p> : null}
            <button className="primary" type="submit" disabled={submitting}>
              <Send size={16} /> {submitting ? 'Sending...' : 'Send Artwork Inquiry'}
            </button>
          </form>
        </div>
      </div>
    </Dialog>
  );
}

function PolicyDialog({ policy, onClose }) {
  return (
    <Dialog labelledBy="policy-title" onClose={onClose}>
      <div className="modal-panel compact-modal">
        <button type="button" className="close" onClick={onClose} aria-label={`Close ${policy.title}`}><X /></button>
        <div className="modal-copy policy-copy">
          <span className="kicker">Mary Adesakin Studio</span>
          <h2 id="policy-title">{policy.title}</h2>
          {policy.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <small>Effective 4 August 2026.</small>
        </div>
      </div>
    </Dialog>
  );
}

function PrintPricing({ artwork, fallback, buyLabel, onBuy }) {
  const options = printOptionsFor(artwork);

  if (options.length) {
    return (
      <span className="print-options">
        {options.map((option) => (
          <span key={option.size}>
            <span>{option.size}</span>
            <strong>{money(option.price)}</strong>
            {PAYSTACK_PUBLIC_KEY && isPositivePrice(option.price) && onBuy ? (
              <button type="button" className="print-buy-link" onClick={() => onBuy(option)}>
                <CreditCard size={14} /> {buyLabel}
              </button>
            ) : hasPrintPaymentLink(option) ? (
              <a className="print-buy-link" href={printPaymentUrlFor(option)} target="_blank" rel="noreferrer">
                <ExternalLink size={14} /> {buyLabel}
              </a>
            ) : null}
          </span>
        ))}
      </span>
    );
  }

  return money(artwork.printPrice) || fallback;
}

function PrintBadge() {
  return <span className="print-badge">Print Available</span>;
}

function CheckoutDialog({ artwork, amount, label, onClose, showToast }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ngnAmount, setNgnAmount] = useState(null);

  const loadRate = useCallback(() => {
    if (PAYSTACK_CURRENCY !== 'NGN') return;
    setError('');
    setNgnAmount(null);
    fetchNgnPerUsd()
      .then((rate) => setNgnAmount(Math.round(amount * rate)))
      .catch((err) => setError(err.message));
  }, [amount]);

  useEffect(() => { loadRate(); }, [loadRate]);

  const chargeAmount = PAYSTACK_CURRENCY === 'NGN' ? ngnAmount : amount;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!Number.isFinite(chargeAmount) || chargeAmount <= 0) {
      setError('Exchange rate is not ready — please use the retry button below.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      if (!window.PaystackPop) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://js.paystack.co/v1/inline.js';
          script.onload = resolve;
          script.onerror = () => reject(new Error('Could not load the payment service. Check your connection and try again.'));
          document.head.appendChild(script);
        });
      }

      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email,
        amount: chargeAmount * 100,
        currency: PAYSTACK_CURRENCY,
        ref: `${artwork.slug}-${Date.now()}`,
        metadata: {
          custom_fields: [
            { display_name: 'Buyer Name', variable_name: 'buyer_name', value: name },
            { display_name: 'Phone', variable_name: 'phone', value: phone },
            { display_name: 'Artwork', variable_name: 'artwork', value: artwork.title },
            { display_name: 'Item', variable_name: 'item', value: label },
          ],
        },
        onSuccess: (transaction) => {
          onClose();
          showToast(`Payment received. Reference: ${transaction.reference}. The studio will be in touch about delivery.`);
        },
        onCancel: () => {},
      });

      handler.openIframe();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment could not be started.');
    } finally {
      setLoading(false);
    }
  };

  const ngnDisplay = (Number.isFinite(ngnAmount) && ngnAmount > 0)
    ? `₦${ngnAmount.toLocaleString('en-NG')}`
    : PAYSTACK_CURRENCY === 'NGN' ? 'Loading rate…' : null;

  return (
    <Dialog labelledBy="checkout-title" onClose={onClose}>
      <div className="modal-panel compact-modal">
        <button type="button" className="close" onClick={onClose} aria-label="Close checkout"><X /></button>
        <div className="modal-copy">
          <span className="kicker">{artwork.collection}</span>
          <h2 id="checkout-title">{artwork.title}</h2>
          <p className="spec">{label} — {money(amount)}{ngnDisplay ? ` (${ngnDisplay})` : ''}</p>
          <form className="checkout-form" onSubmit={handleSubmit}>
            <label className="admin-field">
              <span>Full name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
                autoFocus
                required
              />
            </label>
            <label className="admin-field">
              <span>Email address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>
            <label className="admin-field">
              <span>Phone number</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 800 000 0000"
                autoComplete="tel"
                required
              />
            </label>
            <p className="checkout-note">After payment the studio will contact you to confirm your shipping address and arrange delivery.</p>
            {error ? (
              <p className="form-error" role="alert">
                {error}
                {PAYSTACK_CURRENCY === 'NGN' && !Number.isFinite(ngnAmount) ? (
                  <> <button type="button" className="link-btn" onClick={loadRate}>Retry</button></>
                ) : null}
              </p>
            ) : null}
            <button type="submit" className="primary" disabled={loading || (PAYSTACK_CURRENCY === 'NGN' && !Number.isFinite(ngnAmount))}>
              {loading ? 'Loading…' : `Pay ${ngnDisplay ?? money(amount)}`}
            </button>
          </form>
        </div>
      </div>
    </Dialog>
  );
}

function AdminPanel({ artworks, setArtworks, showToast }) {
  const initialCatalogueRef = useRef(null);
  const [addingArtwork, setAddingArtwork] = useState(false);
  const [draft, setDraft] = useState(emptyArtworkDraft);
  const [draftImage, setDraftImage] = useState(null);
  const [draftError, setDraftError] = useState('');
  const [testAmount, setTestAmount] = useState('10');
  const [testCheckout, setTestCheckout] = useState(null);
  const [payments, setPayments] = useState(null);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const pricedOriginals = artworks.filter((art) => isPositivePrice(art.originalPrice)).length;
  const pricedPrints = artworks.filter(hasPrintPricing).length;
  const publishableArtworks = artworks.map(({ _previewImage, ...artwork }) => artwork);
  const currentCatalogueJson = JSON.stringify(publishableArtworks);
  const hasUnsavedChanges = Boolean(initialCatalogueRef.current && currentCatalogueJson !== initialCatalogueRef.current);

  useEffect(() => {
    if (artworks.length && initialCatalogueRef.current === null) {
      initialCatalogueRef.current = currentCatalogueJson;
    }
  }, [artworks.length, currentCatalogueJson]);

  const updatePrice = (id, field, value) => {
    setArtworks((items) => items.map((art) => (
      art.id === id ? { ...art, [field]: normalizePrice(value) } : art
    )));
  };

  const updateField = (id, field, value) => {
    setArtworks((items) => items.map((art) => (
      art.id === id ? { ...art, [field]: value.trim() } : art
    )));
  };

  const updatePrintOption = (id, optionIndex, field, value) => {
    setArtworks((items) => items.map((art) => (
      art.id === id
        ? {
          ...art,
          printOptions: art.printOptions.map((option, index) => (
            index === optionIndex
              ? { ...option, [field]: field === 'price' ? normalizePrice(value) : value.trim() }
              : option
          )),
        }
        : art
    )));
  };

  const updateDraft = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const addArtwork = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    if (!draftImage) {
      setDraftError('Choose an artwork image.');
      return;
    }
    const printPrice = normalizePrice(draft.printPrice);
    const printSize = draft.printSize.trim();
    if (Boolean(printPrice) !== Boolean(printSize)) {
      setDraftError('Add both a print size and a print price, or leave both blank.');
      return;
    }
    const paymentLinks = [draft.paystackPaymentUrl, draft.printPaystackUrl];
    if (paymentLinks.some((link) => link.trim() && !isPaystackPaymentUrl(link.trim()))) {
      setDraftError('Use a valid secure Paystack payment or product link.');
      return;
    }

    setAddingArtwork(true);
    setDraftError('');

    try {
      const slug = uniqueArtworkSlug(draft.title, artworks);
      const preparedImage = await optimizeArtworkUpload(draftImage, slug);
      const previewImage = URL.createObjectURL(preparedImage.blob);

      let imageUrl = `assets/artwork/${preparedImage.filename}`;
      let uploadedToBlob = false;
      try {
        const uploadRes = await fetch(
          `/api/upload-artwork?filename=${encodeURIComponent(preparedImage.filename)}`,
          { method: 'POST', body: preparedImage.blob, headers: { 'content-type': 'image/webp', 'x-admin-token': ADMIN_TOKEN } },
        );
        if (uploadRes.ok) {
          const result = await uploadRes.json();
          imageUrl = result.url;
          uploadedToBlob = true;
        }
      } catch {
        // Blob API not available (local dev) — fall through to local download
      }
      if (!uploadedToBlob) downloadBlob(preparedImage.blob, preparedImage.filename);

      const artwork = {
        id: nextArtworkId(artworks),
        slug,
        title: draft.title.trim(),
        collection: draft.collection.trim(),
        year: draft.year.trim(),
        medium: draft.medium.trim(),
        dimensions: draft.dimensions.trim(),
        originalPrice: normalizePrice(draft.originalPrice),
        printPrice: null,
        ...(printPrice && printSize ? {
          printOptions: [{
            size: printSize,
            price: printPrice,
            paystackPaymentUrl: draft.printPaystackUrl.trim(),
          }],
        } : {}),
        status: draft.status,
        edition: draft.edition.trim(),
        provenance: draft.provenance.trim(),
        image: imageUrl,
        paystackPaymentUrl: draft.paystackPaymentUrl.trim(),
        description: {
          en: draft.description.trim(),
          yo: '',
          fr: '',
        },
        _previewImage: previewImage,
      };

      setArtworks((items) => [...items, artwork]);
      setDraft(emptyArtworkDraft());
      setDraftImage(null);
      form.reset();
      showToast(
        uploadedToBlob
          ? `${artwork.title} added. Image uploaded to storage.`
          : `${artwork.title} added. Optimised image downloaded — copy to public/assets/artwork/.`,
      );
    } catch (error) {
      setDraftError(error instanceof Error ? error.message : 'The artwork could not be added.');
    } finally {
      setAddingArtwork(false);
    }
  };

  const loadPayments = async (page = 1) => {
    setPaymentsLoading(true);
    try {
      const res = await fetch(`/api/transactions?perPage=20&page=${page}&status=success`, {
        headers: { 'x-admin-token': ADMIN_TOKEN },
      });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to load');
      const body = await res.json();
      setPayments(body);
      setPaymentsPage(page);
    } catch (err) {
      showToast(err.message ?? 'Could not load payments.');
    } finally {
      setPaymentsLoading(false);
    }
  };

  const exportJson = () => {
    const json = JSON.stringify(publishableArtworks, null, 2);
    const blob = new Blob([`${json}\n`], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'artworks.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    initialCatalogueRef.current = currentCatalogueJson;
    showToast('Download complete. Replace public/data/artworks.json, then commit and push.');
  };

  const publishCatalogue = async () => {
    const json = JSON.stringify(publishableArtworks, null, 2);
    try {
      const res = await fetch('/api/publish-catalogue', {
        method: 'POST',
        body: `${json}\n`,
        headers: { 'content-type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
      });
      if (!res.ok) throw new Error();
      initialCatalogueRef.current = currentCatalogueJson;
      showToast('Catalogue published to storage.');
    } catch {
      showToast('Publish failed — use Export JSON as a backup.');
    }
  };

  const resetCatalogue = () => {
    if (!initialCatalogueRef.current) return;
    setArtworks(JSON.parse(initialCatalogueRef.current));
    showToast('Catalogue edits reset.');
  };

  return (
    <section id="admin" className="admin-panel">
      <div className="admin-head">
        <div>
          <span className="kicker"><Settings size={16} /> Catalogue Admin</span>
          <h1>Artwork Catalogue Editor</h1>
          <p>Add artworks, edit prices, and add verified Paystack Product Links, then export the updated catalogue.</p>
        </div>
        <div className="admin-head-actions">
          <span className={hasUnsavedChanges ? 'save-state dirty' : 'save-state'}>
            {hasUnsavedChanges ? 'Unsaved changes' : 'No unsaved changes'}
          </span>
          <button type="button" className="admin-download" onClick={resetCatalogue} disabled={!hasUnsavedChanges}>
            Reset
          </button>
          <button type="button" className="primary" onClick={publishCatalogue}>
            <Send size={16} /> Publish
          </button>
          <button type="button" className="admin-download" onClick={exportJson}>
            <Download size={16} /> Export JSON
          </button>
        </div>
      </div>

      <details className="admin-add-panel">
        <summary><ImagePlus size={18} /> Add New Artwork</summary>
        <form className="admin-add-form" onSubmit={addArtwork}>
          <label className="admin-field">
            <span>Artwork title</span>
            <input value={draft.title} onChange={(event) => updateDraft('title', event.target.value)} maxLength="120" required />
          </label>
          <label className="admin-field">
            <span>Collection</span>
            <input value={draft.collection} onChange={(event) => updateDraft('collection', event.target.value)} maxLength="120" required />
          </label>
          <label className="admin-field">
            <span>Year</span>
            <input value={draft.year} onChange={(event) => updateDraft('year', event.target.value)} inputMode="numeric" pattern="[0-9]{4}" maxLength="4" required />
          </label>
          <label className="admin-field">
            <span>Status</span>
            <select value={draft.status} onChange={(event) => updateDraft('status', event.target.value)}>
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
            </select>
          </label>
          <label className="admin-field">
            <span>Medium</span>
            <input value={draft.medium} onChange={(event) => updateDraft('medium', event.target.value)} maxLength="160" required />
          </label>
          <label className="admin-field">
            <span>Dimensions</span>
            <input value={draft.dimensions} onChange={(event) => updateDraft('dimensions', event.target.value)} maxLength="80" placeholder="24 x 30 inches" required />
          </label>
          <label className="admin-field">
            <span>Original price in USD</span>
            <input type="number" min="1" step="1" value={draft.originalPrice} onChange={(event) => updateDraft('originalPrice', event.target.value)} placeholder="Leave blank for price on request" />
          </label>
          <label className="admin-field">
            <span>Edition</span>
            <input value={draft.edition} onChange={(event) => updateDraft('edition', event.target.value)} maxLength="100" required />
          </label>
          <label className="admin-field admin-field-wide">
            <span>Description</span>
            <textarea value={draft.description} onChange={(event) => updateDraft('description', event.target.value)} rows="4" maxLength="1200" required />
          </label>
          <label className="admin-field admin-field-wide">
            <span>Provenance</span>
            <input value={draft.provenance} onChange={(event) => updateDraft('provenance', event.target.value)} maxLength="240" required />
          </label>
          <label className="admin-field">
            <span>Print size</span>
            <input value={draft.printSize} onChange={(event) => updateDraft('printSize', event.target.value)} maxLength="80" placeholder="10 x 12 inches" />
          </label>
          <label className="admin-field">
            <span>Print price in USD</span>
            <input type="number" min="1" step="1" value={draft.printPrice} onChange={(event) => updateDraft('printPrice', event.target.value)} />
          </label>
          {PAYSTACK_PUBLIC_KEY ? (
            <p className="admin-add-help admin-field-wide">Paystack Inline is active — checkout uses the artwork price automatically. No manual payment links needed.</p>
          ) : (
            <>
              <label className="admin-field">
                <span>Original Paystack Product Link</span>
                <input type="url" inputMode="url" value={draft.paystackPaymentUrl} onChange={(event) => updateDraft('paystackPaymentUrl', event.target.value)} placeholder="https://paystack.com/buy/..." />
              </label>
              <label className="admin-field">
                <span>Print Paystack Product Link</span>
                <input type="url" inputMode="url" value={draft.printPaystackUrl} onChange={(event) => updateDraft('printPaystackUrl', event.target.value)} placeholder="https://paystack.com/buy/..." />
              </label>
            </>
          )}
          <label className="admin-field">
            <span>Artwork image</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setDraftImage(event.target.files?.[0] || null)} required />
          </label>
          <p className="admin-add-help admin-field-wide">The image is resized to 1,400 pixels max and converted to WebP. On Vercel it uploads to storage automatically; in local development it downloads — copy it to <code>public/assets/artwork</code> before pushing.</p>
          {draftError ? <p className="form-error admin-field-wide" role="alert">{draftError}</p> : null}
          <button className="primary admin-add-submit" type="submit" disabled={addingArtwork}>
            <ImagePlus size={16} /> {addingArtwork ? 'Preparing Artwork...' : 'Add Artwork'}
          </button>
        </form>
      </details>

      <div className="admin-summary">
        <p><strong>{artworks.length}</strong><span>Total works</span></p>
        <p><strong>{pricedOriginals}</strong><span>Original prices</span></p>
        <p><strong>{pricedPrints}</strong><span>Print prices</span></p>
      </div>

      <div className="admin-note">
        <strong>How to publish catalogue edits:</strong>
        <span>Click <strong>Publish</strong> to push changes live instantly. Use <strong>Export JSON</strong> as a backup for git deployment.</span>
      </div>

      {PAYSTACK_PUBLIC_KEY ? (
        <details className="admin-add-panel">
          <summary><CreditCard size={18} /> Test Checkout</summary>
          <div className="admin-test-checkout">
            <p className="admin-add-help">Open a real Paystack checkout with your current public key. Use this to verify the payment flow before going live. Enter your test card details to complete a test payment.</p>
            <div className="admin-test-row">
              <label className="admin-field">
                <span>Test amount (USD)</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={testAmount}
                  onChange={(e) => setTestAmount(e.target.value)}
                />
              </label>
              <button
                type="button"
                className="primary"
                onClick={() => setTestCheckout({ slug: 'test-payment', title: 'Test Payment', collection: 'Admin Test', originalPrice: Number(testAmount) || 10 })}
              >
                <CreditCard size={16} /> Open Test Checkout
              </button>
            </div>
          </div>
        </details>
      ) : null}

      <details className="admin-add-panel">
        <summary><ExternalLink size={18} /> Payment Records</summary>
        <div className="admin-payments">
          <div className="admin-payments-head">
            <p className="admin-add-help">Recent successful payments from Paystack. Requires <code>PAYSTACK_SECRET_KEY</code> to be configured on the server.</p>
            <button type="button" className="primary" onClick={() => loadPayments(1)} disabled={paymentsLoading}>
              {paymentsLoading ? 'Loading…' : payments ? 'Refresh' : 'Load Payments'}
            </button>
          </div>
          {payments ? (
            payments.data?.length ? (
              <>
                <div className="admin-payments-table" role="table" aria-label="Payment records">
                  <div className="admin-payments-row admin-payments-header" role="row">
                    <span role="columnheader">Date</span>
                    <span role="columnheader">Buyer</span>
                    <span role="columnheader">Artwork</span>
                    <span role="columnheader">Amount</span>
                    <span role="columnheader">Reference</span>
                  </div>
                  {payments.data.map((tx) => {
                    const fields = Array.isArray(tx.metadata?.custom_fields) ? tx.metadata.custom_fields : [];
                    const field = (name) => fields.find((f) => f.variable_name === name)?.value ?? '—';
                    const date = new Date(tx.paid_at ?? tx.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                    return (
                      <div className="admin-payments-row" role="row" key={tx.id}>
                        <span role="cell">{date}</span>
                        <span role="cell">
                          <strong>{field('buyer_name')}</strong>
                          <small>{tx.customer?.email}</small>
                          <small>{field('phone')}</small>
                        </span>
                        <span role="cell">
                          <strong>{field('artwork')}</strong>
                          <small>{field('item')}</small>
                        </span>
                        <span role="cell">{money(tx.amount / 100)}</span>
                        <span role="cell" className="admin-payments-ref">{tx.reference}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="admin-payments-nav">
                  <button type="button" onClick={() => loadPayments(paymentsPage - 1)} disabled={paymentsLoading || paymentsPage <= 1}>← Previous</button>
                  <span>Page {paymentsPage}</span>
                  <button type="button" onClick={() => loadPayments(paymentsPage + 1)} disabled={paymentsLoading || payments.data.length < 20}>Next →</button>
                </div>
              </>
            ) : (
              <p className="admin-add-help" style={{ padding: '18px' }}>No payments found.</p>
            )
          ) : null}
        </div>
      </details>

      <div className="admin-table" aria-label="Artwork price editor">
        {artworks.map((art) => (
          <article className="admin-row" key={art.id}>
            <img src={art._previewImage || `${import.meta.env.BASE_URL}${art.image}`} alt={art.title} loading="lazy" decoding="async" />
            <div className="admin-artwork">
              <span className={art.status === 'Sold' ? 'sold badge' : 'available badge'}>{art.status}</span>
              <h2>{art.title}</h2>
              <p>{art.medium} / {art.dimensions} / {art.year}</p>
            </div>
            <label className="admin-field">
              <span>Original price</span>
              <input
                type="number"
                min="1"
                step="1"
                value={art.originalPrice ?? ''}
                onChange={(event) => updatePrice(art.id, 'originalPrice', event.target.value)}
                placeholder="Price on request"
              />
            </label>
            <div className="admin-print-fields">
              {Array.isArray(art.printOptions) && art.printOptions.length ? art.printOptions.map((option, index) => (
                <label className="admin-field" key={option.size}>
                  <span>Print {option.size}</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={option.price ?? ''}
                    onChange={(event) => updatePrintOption(art.id, index, 'price', event.target.value)}
                    placeholder="Price"
                  />
                </label>
              )) : (
                <label className="admin-field">
                  <span>Print price</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={art.printPrice ?? ''}
                    onChange={(event) => updatePrice(art.id, 'printPrice', event.target.value)}
                    placeholder="Available by inquiry"
                  />
                </label>
              )}
            </div>
            {!PAYSTACK_PUBLIC_KEY ? (
              <div className="admin-payment-fields">
                <label className="admin-field">
                  <span>Original Paystack Product Link</span>
                  <input
                    type="url"
                    inputMode="url"
                    value={art.paystackPaymentUrl ?? ''}
                    onChange={(event) => updateField(art.id, 'paystackPaymentUrl', event.target.value)}
                    placeholder="https://paystack.com/buy/..."
                  />
                </label>
                {Array.isArray(art.printOptions) ? art.printOptions.map((option, index) => (
                  <label className="admin-field" key={`payment-${option.size}`}>
                    <span>Print {option.size} Paystack Product Link</span>
                    <input
                      type="url"
                      inputMode="url"
                      value={option.paystackPaymentUrl ?? ''}
                      onChange={(event) => updatePrintOption(art.id, index, 'paystackPaymentUrl', event.target.value)}
                      placeholder="https://paystack.com/buy/..."
                    />
                  </label>
                )) : null}
              </div>
            ) : null}
          </article>
        ))}
      </div>

      {testCheckout ? (
        <CheckoutDialog
          artwork={testCheckout}
          amount={Number(testAmount) || 10}
          label="Test payment"
          onClose={() => setTestCheckout(null)}
          showToast={showToast}
        />
      ) : null}
    </section>
  );
}

createRoot(document.getElementById('root')).render(<App />);
