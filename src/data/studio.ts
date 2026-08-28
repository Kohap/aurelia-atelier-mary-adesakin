export const artist = {
  name: "Adesakin Mary Damilola",
  born: "2002",
  place: "Ile-Ife, Osun State, Nigeria",
  email: "adesakinmary2020@gmail.com",
  phone: "+234 906 700 2871",
  whatsapp: "https://wa.me/2349067002871",
  instagram: "https://www.instagram.com/adesakinmarydamilola",
  tiktok: "https://www.tiktok.com/@dammy017",
  facebook: "https://www.facebook.com/share/1DzBXHzfPN/?mibextid=wwXIfr",
  portrait: "/studio/mary-adesakin.webp",
  portraitCredit: "Perfect Lenz",
  education:
    "Fine and Applied Arts, Adeyemi College of Education (affiliated to Obafemi Awolowo University), graduated 2024.",
  mentorship: "Mentorship with contemporary artist Toheeb Ibrahim.",
  statement:
    "My practice explores themes of vulnerability, struggle, culture, and resilience through textile-based portraiture using thread and acrylic. I use thread as both a material and a language to connect fragments of memory, identity, and lived experience — a line that repairs, remembers, conceals, reveals, and binds what words cannot always carry.",
  bio: [
    "Adesakin Mary Damilola is a Nigerian visual artist from Ile-Ife whose practice focuses on thread painting and acrylic. Born in 2002, she explores identity, memory, Yoruba heritage, womanhood, and emotional repair through layered, hand-stitched compositions.",
    "She studied Fine and Applied Arts at Adeyemi College of Education, affiliated to Obafemi Awolowo University, and now works as a full-time artist. For Mary, each stitch is a form of storytelling that invites reflection on emotion, memory, and the legacy we carry.",
    "Her work has been exhibited in Nigeria and internationally, including Deep in Thought, La Beauté Vue par les Artistes in Paris, the SWANS Female Exhibition, Tola Wewe Art Gallery, House of George, and the Life In My City Art Festival. Works are held in private collections.",
  ],
};

export const exhibitions = [
  {
    year: "2026",
    title: "SWANS Female Exhibition",
    venue: "Signature Beyond Art Gallery, Lagos",
    note: "A gathering of contemporary women artists.",
  },
  {
    year: "2025",
    title: "La Beauté Vue par les Artistes",
    venue: "Paris, France",
    note: "International group presentation of beauty as seen by artists.",
  },
  {
    year: "2025",
    title: "Tola Wewe Art Gallery",
    venue: "Ondo, Nigeria",
    note: "Gallery presentation of recent thread paintings.",
  },
  {
    year: "2025",
    title: "House of George Art and Craft Gallery",
    venue: "Nigeria",
    note: "Selected studio works.",
  },
  {
    year: "2024",
    title: "Deep in Thought",
    venue: "Annual Contemporary Art Showcase",
    note: "Early public presentation of the thread practice.",
  },
  {
    year: "2024",
    title: "Life In My City Art Festival",
    venue: "Ondo Regional Zone",
    note: "Loud Silence shown at LIMCAF.",
  },
];

export const processSteps = [
  {
    numeral: "01",
    title: "Ground",
    copy: "Canvas, jute, or linen is stretched and stained. Acrylic is laid as a first weather — the climate the figure will inhabit.",
    image: "/studio/worktable.jpg",
  },
  {
    numeral: "02",
    title: "The first stitch",
    copy: "A single thread is pulled taut. It is both drawing and wound. Direction is chosen the way a voice chooses a first word.",
    image: "/studio/thread-macro.jpg",
  },
  {
    numeral: "03",
    title: "Building the face",
    copy: "Hundreds of passes accumulate into skin, scarification, cloth, and shadow. What painting would blend, thread keeps visible — every decision remains on the surface.",
    image: "/studio/ife-bronze.jpg",
  },
  {
    numeral: "04",
    title: "Release",
    copy: "Loose strands are left to hang. The work is not sealed against time; it is allowed to breathe, to catch light, to keep a little unfinished truth.",
    image: "/artwork/loud-silence.webp",
  },
];

export type StitchFilm = {
  id: string;
  kind: "instagram" | "tiktok";
  title: string;
  caption: string;
  href: string;
  embed?: string;
  videoId?: string;
  poster?: string;
  posterPosition?: string;
};

export const stitchFilms: StitchFilm[] = [
  {
    id: "unseen",
    kind: "instagram",
    title: "Unseen moments",
    caption:
      "Behind every finished work are countless unseen moments like this — from Mary’s Instagram, July 2026.",
    href: "https://www.instagram.com/reel/DadN_ehNpbG/",
    embed: "https://www.instagram.com/reel/DadN_ehNpbG/embed",
    poster: "/studio/thread-macro.jpg",
  },
  {
    id: "intention",
    kind: "instagram",
    title: "Every thread",
    caption:
      "Every thread is placed with intention, gradually building texture, depth, and emotion — from Mary’s Instagram.",
    href: "https://www.instagram.com/reel/Dblrw_8tnL3/",
    embed: "https://www.instagram.com/reel/Dblrw_8tnL3/embed",
    poster: "/studio/worktable.jpg",
  },
  {
    id: "showing",
    kind: "tiktok",
    title: "Showing the work",
    caption: "Thread paintings presented from the studio TikTok, @dammy017.",
    href: "https://www.tiktok.com/@dammy017/video/7542423924022299922",
    videoId: "7542423924022299922",
    poster: "/studio/films/showing.webp",
    posterPosition: "center 12%",
  },
  {
    id: "weave",
    kind: "tiktok",
    title: "Weaving the space",
    caption: "Bespoke thread painting — booking from the studio account.",
    href: "https://www.tiktok.com/@dammy017/video/7526847375445478662",
    videoId: "7526847375445478662",
    poster: "/studio/films/weave.webp",
    posterPosition: "center center",
  },
];

export const faqs = [
  {
    q: "How do I acquire an original?",
    a: "Open the work and send an inquiry, or add it to a shortlist and write from there. The studio confirms availability, condition, packing, and shipping in writing before any sale is complete.",
  },
  {
    q: "Do you take commissions?",
    a: "Yes. Portrait and thematic commissions begin with a conversation about subject, scale, and timeline. A written agreement and deposit confirm the start of work.",
  },
  {
    q: "Are prints available?",
    a: "Selected works have print sizes listed. Prints are studio-supervised and priced separately from the original. Colour and thread texture will always be truer in the original.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes. Packing, insurance, and export are arranged after the sale is confirmed. Collectors are responsible for local duties and taxes unless otherwise agreed.",
  },
  {
    q: "Can I visit the studio?",
    a: "The studio is in Ile-Ife, Osun State. Visits are by appointment for collectors, curators, and writers. Write to request a time.",
  },
];

export type PolicyBlock = {
  heading?: string;
  body: string;
};

export const policyUpdated = "28 August 2026";

export const policies: Record<"terms" | "returns" | "privacy", PolicyBlock[]> = {
  terms: [
    {
      heading: "The studio",
      body: "Arteli is the Ile-Ife atelier of Nigerian thread painter Adesakin Mary Damilola (born 2002, Osun State, Nigeria). These terms govern use of arteli.site and any acquisition, print, commission, studio visit, or press request made through it. Writing to adesakinmary2020@gmail.com, +234 906 700 2871, or the studio WhatsApp is writing to the same studio.",
    },
    {
      heading: "What this site is",
      body: "The site is a collector catalogue: original thread paintings (thread and acrylic on canvas, jute, or linen), selected studio-supervised prints, journal notes, exhibition history, a press sheet, and a way to inquire or pay. It is not an auction, a marketplace for other artists, or a signed-in account service. Catalogue details — title, series, year, medium, dimensions, provenance, price, and Available or Sold — are studio reference and may be updated when a work is acquired or a new piece is released.",
    },
    {
      heading: "Looking is not buying",
      body: "An inquiry, a copied link, a shared page, a collector-list signup, or a shortlist bookmark does not reserve a work and does not create a contract. A sale exists only after the studio confirms the work in writing (title, condition, price, packing, destination) and payment has cleared. Sold works remain in the catalogue as a record of the practice; they are not for sale.",
    },
    {
      heading: "Originals",
      body: "Each original is a unique handmade work. Loose hanging threads, visible stitch, slight irregularity of surface, and the way light catches the fibre are part of the piece, not faults. Before an original leaves Ile-Ife the studio confirms condition, packing, and shipping. Where the studio issues documentation or a certificate of authenticity, that document travels with the work. Framing and installation are not included unless agreed in writing.",
    },
    {
      heading: "Prints",
      body: "Prints exist only where a size and price are listed on the work. They are studio-supervised reproductions, priced apart from the original. Colour, relief, and thread texture are always truer in the original. The wall view and scale figure on a work page are aids for hanging, not a promise that a print will match a room. Prints are not numbered limited editions unless the studio states an edition in writing.",
    },
    {
      heading: "Commissions",
      body: "Portrait and thematic commissions begin with a conversation about subject, scale, timeline, and feeling. No thread is pulled until a written agreement and a deposit are in place. Sketches, progress images, and the finished work remain Mary’s copyright. The collector receives the physical work; reproduction, merchandising, and exhibition of images stay with the artist unless the agreement says otherwise.",
    },
    {
      heading: "Prices, currency, and Paystack",
      body: "Catalogue prices are listed in US dollars. You may view approximate NGN or EUR conversions on the site; those figures are for reading only. Checkout through Paystack charges Nigerian naira at the day’s published USD/NGN rate. The amount shown in the Paystack window is the amount billed. A successful charge is acknowledged by email where the studio’s payment webhook is configured; the studio still writes to confirm packing and a shipping address before a work is dispatched. If a work is no longer available when payment lands, the studio refunds in full.",
    },
    {
      heading: "Shipping, insurance, and duties",
      body: "Works leave the studio in Ile-Ife. Packing, insurance, and export are arranged after the sale is confirmed — not at the moment of checkout. Delivery time depends on destination, carrier, and any export paperwork. Prices do not include packing, insurance, freight, customs, import VAT, or brokerage unless the studio states so in writing. Those local charges sit with the collector.",
    },
    {
      heading: "Images, scale, and the wall view",
      body: "Photographs, the scale figure, and the gallery-wall view are made to help you see. Screens differ. Thread catches light in a way a file cannot. Request more stills or a short film from the studio before you pay if colour or scale matters to the room. Journal notes, exhibition listings, and the press sheet are editorial; they are not a condition report.",
    },
    {
      heading: "Copyright",
      body: "Copyright, moral rights, image rights, and the right to reproduce, exhibit, or license every work — including photographs of works on this site — remain with Adesakin Mary Damilola. Buying an original or a print is buying the object, not the image rights. Do not crop studio photographs for resale, NFTs, training data, or merchandise without written permission.",
    },
    {
      heading: "Visits and press",
      body: "The studio receives collectors, curators, and writers by appointment in Ile-Ife. The press sheet is for editors and lenders; high-resolution files are sent on request, not downloaded as a public archive.",
    },
    {
      heading: "Language and law",
      body: "The catalogue can be read in English, Yorùbá, and French. These policies are issued in English, and the English text governs. The studio is in Nigeria. These terms are governed by the laws of the Federal Republic of Nigeria. If a court finds one clause unenforceable, the rest still apply. Statutory rights that cannot be excluded by contract remain.",
    },
  ],
  returns: [
    {
      heading: "Originals and commissions",
      body: "Original thread paintings are unique handmade works. Once payment is confirmed they are final sale: prepared, packed, and documented for one collector. Change of mind, a different wall colour, or a screen that showed the thread cooler or warmer than the room is not a ground for return. Commissions follow the written agreement — deposits, staged payments, and cancellation are those terms, not this page.",
    },
    {
      heading: "Prints",
      body: "Prints may be reviewed if there is a studio production fault, a fulfilment error (wrong size or work), or damage in transit. Returns are not accepted for change of mind, for colour that differs from a phone or laptop, or for an address or size the collector supplied incorrectly.",
    },
    {
      heading: "Damage in transit",
      body: "If an original or a print arrives damaged, write to adesakinmary2020@gmail.com within forty-eight hours of delivery. Include your name, the work title, the Paystack or studio reference, photographs of the outer packing, and photographs of the damage. Keep every carton, corner, and wrap until the studio or the carrier says otherwise. Claims opened after the packing is thrown away are much harder to honour.",
    },
    {
      heading: "What the studio can do",
      body: "Where a valid fault, packing failure, or carrier claim is confirmed, the studio may repair, replace a print, offer studio credit, or refund in whole or in part — whichever is fair for that work, that edition, and that route. An original cannot always be replaced; in that case a refund or another work from the catalogue may be offered.",
    },
    {
      heading: "Payments that should not have been taken",
      body: "If Paystack charges twice, if a test or cancelled checkout still settles, or if you paid for a work the studio can no longer release, write with the reference. Those amounts are refunded to the original method once the studio and Paystack confirm the charge. Refund timing follows the card network, often several working days.",
    },
    {
      heading: "Before a work is packed",
      body: "If you need to stop an order after payment but before the studio has packed the work, write immediately. Originals and commissions are already unique or underway; the studio will say in writing whether a refund, a credit, or the agreement’s cancellation clause applies. Once a work is with the carrier, the damage process above is the path — not a change of mind.",
    },
  ],
  privacy: [
    {
      heading: "Who holds your details",
      body: "Arteli / Adesakin Mary Damilola, Ile-Ife, Osun State, Nigeria, is the studio responsible for personal information sent through this site. Write adesakinmary2020@gmail.com for access, correction, or deletion. The studio follows Nigeria’s Data Protection Act 2023 in plain studio practice: collect little, keep it for the purpose, and do not sell it.",
    },
    {
      heading: "What we collect, and why",
      body: "Inquiry and contact forms (name, email, interest, message, and any artwork named) so the studio can reply. Checkout (name, email, phone) so Paystack can charge and the studio can pack and ship. Collector-list signup (email) so the studio can send first look at new works. Paystack also receives the work title and the item paid for (original or a named print size) as payment metadata. After a successful charge the studio may send an order note to the email you gave.",
    },
    {
      heading: "What stays only on your device",
      body: "The collector shortlist, language, currency, and light or night studio preference are stored in this browser (local storage). They are not an account. Clearing the browser clears them. No login exists on the public site.",
    },
    {
      heading: "What we do not want",
      body: "Do not send card numbers, PINs, BVN, NIN, passports, or passwords through an inquiry, WhatsApp, or email form. Paystack’s own window is the only place card details should be typed. The studio never sees full card numbers.",
    },
    {
      heading: "Who processes data for the studio",
      body: "Formspree carries inquiry, contact, and collector-list messages. Paystack processes payments in naira. Where configured, Resend sends the order confirmation after a successful charge. The site is hosted on Vercel. A public exchange-rate service is used to show NGN and EUR and to price the Paystack charge; that request does not include your name. Instagram, TikTok, and Facebook apply if you open process films or follow those links. Each of those services has its own policy.",
    },
    {
      heading: "Sharing",
      body: "The studio shares what is needed to complete a request you made: a shipper, insurer, framer, printer, or customs agent may receive a name, destination, and work title. The studio does not sell, rent, or trade collector lists. We will disclose information if Nigerian law requires it.",
    },
    {
      heading: "How long we keep it",
      body: "Inquiry and collector-list mail is kept while it is useful to serve you and to keep a responsible studio record of acquisitions, then deleted or archived on request. Payment references are kept as long as tax, chargeback, and shipping records require. You may ask to leave the collector list at any time by writing the studio.",
    },
    {
      heading: "Your rights",
      body: "You may ask what the studio holds, ask for a correction, ask for deletion, or withdraw consent for the collector list. The studio will answer to adesakinmary2020@gmail.com. Some payment and shipping records must be kept for law even after a marketing list is cleared.",
    },
    {
      heading: "Children and cookies",
      body: "This catalogue is written for adult collectors, curators, and press. It is not directed at children. The public site does not set an advertising cookie. Payment and film embeds may set their own cookies when you open Paystack or play an Instagram or TikTok film.",
    },
    {
      heading: "Changes",
      body: "When these policies change, the date at the top of this text is updated. Continued use of the site after that date is use under the new text. The English version is the binding one.",
    },
  ],
};


export const nav = [
  { to: "/catalogue", label: "Works" },
  { to: "/artist", label: "Artist" },
  { to: "/studio", label: "Studio" },
  { to: "/exhibitions", label: "Exhibitions" },
  { to: "/contact", label: "Contact" },
] as const;
