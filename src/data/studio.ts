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

export const policies = {
  terms: [
    "All artworks, prices, dimensions, images, and availability are for studio and collector reference. Availability is confirmed only in writing.",
    "An inquiry, shortlist, or copied link does not reserve a work. A sale is complete only after the studio agrees final details and payment has cleared.",
    "Prices do not include packing, insurance, shipping, customs, or installation unless stated in writing.",
    "Copyright and reproduction rights remain with Mary Adesakin Damilola unless a separate written agreement says otherwise.",
  ],
  returns: [
    "Originals, commissions, and reserved works are final sale once payment is confirmed.",
    "Prints may be reviewed if there is a production fault or damage in transit. Change of mind is not accepted.",
    "Report damage within 48 hours with photographs of packaging and the work. Keep original packing until the studio advises.",
  ],
  privacy: [
    "The studio collects only what is needed to answer inquiries, prepare acquisitions, and arrange shipping.",
    "Forms are processed by Formspree. Payment providers handle card details — the studio does not store them.",
    "Personal information is not sold. Write adesakinmary2020@gmail.com to request access, correction, or deletion.",
  ],
};

export const nav = [
  { to: "/catalogue", label: "Works" },
  { to: "/artist", label: "Artist" },
  { to: "/studio", label: "Studio" },
  { to: "/exhibitions", label: "Exhibitions" },
  { to: "/contact", label: "Contact" },
] as const;
