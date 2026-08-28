import type { Lang } from "@/data/i18n";

export type PrintOption = {
  size: string;
  price: number;
  paystackPaymentUrl?: string;
};

export type Localized = Record<Lang, string>;

export type Artwork = {
  id: number;
  slug: string;
  title: string;
  collection: string;
  year: string;
  medium: string;
  dimensions: string;
  originalPrice: number | null;
  printOptions: PrintOption[];
  status: "Available" | "Sold";
  edition: string;
  provenance: string;
  image: string;
  description: Localized;
};

export const artworks: Artwork[] = [
  {
    id: 1,
    slug: "the-weight-of-words",
    title: "The Weight of Words",
    collection: "Thread Narratives",
    year: "2025",
    medium: "Thread on Canvas",
    dimensions: "30 × 32 inches",
    originalPrice: 2500,
    printOptions: [
      { size: "10 × 12 inches", price: 100 },
      { size: "16 × 20 inches", price: 200 },
    ],
    status: "Available",
    edition: "Original work",
    provenance: "Original catalogue work by Mary Adesakin Damilola.",
    image: "/artwork/the-weight-of-words.webp",
    description: {
      en: "This art piece depicts a man immersed in a newspaper, seated in his private library. The work reflects on media, solitude, and the psychological weight of staying informed in an age of constant updates.",
      yo: "Iṣẹ́ yìí ń wo bí ìròyìn, ìpàlà mọ́ inú, àti ìwúwo èrò ṣe ń kan ènìyàn.",
      fr: "Cette œuvre réfléchit au poids psychologique de l'information, de la solitude et des médias.",
    },
  },
  {
    id: 2,
    slug: "maze-of-uncertainty",
    title: "Maze of Uncertainty",
    collection: "Maze of Uncertainty",
    year: "2025",
    medium: "Thread and Acrylic on Canvas",
    dimensions: "20 × 24 inches",
    originalPrice: null,
    printOptions: [{ size: "10 × 12 inches", price: 100 }],
    status: "Sold",
    edition: "Original work",
    provenance: "Original catalogue work by Mary Adesakin Damilola.",
    image: "/artwork/maze-of-uncertainty-sold-2025.webp",
    description: {
      en: "Maze of Uncertainty was created as a reflection on the moments in life when the path ahead feels unclear. Through the woman's contemplative gaze and the shifting colors of the background, I explore how vulnerability and strength coexist in times of doubt.",
      yo: "Maze of Uncertainty ń sọ̀rọ̀ nípa àkókò tí ọ̀nà ìwájú kò yé wa, àti bí àìlera àti agbára ṣe le wà pọ̀.",
      fr: "Maze of Uncertainty explore les moments où le chemin semble incertain, entre vulnérabilité, force et résilience.",
    },
  },
  {
    id: 4,
    slug: "loud-silence",
    title: "Loud Silence",
    collection: "Witness and Voice",
    year: "2025",
    medium: "Thread on Jute",
    dimensions: "42 × 51 inches",
    originalPrice: 3000,
    printOptions: [],
    status: "Available",
    edition: "Original work",
    provenance: "Featured at the Life In My City Art Festival, Ondo Regional Zone.",
    image: "/artwork/loud-silence.webp",
    description: {
      en: "Loud Silence captures a frozen scream, a suspended moment of agony, a cry for breath, and a plea for justice. The loose vertical threads split the face and conceal the voice.",
      yo: "Loud Silence ń mú ìgbé inú, ìrora, àti ìpè fún òdodo hàn pẹ̀lú òkùn.",
      fr: "Loud Silence saisit un cri suspendu, une douleur retenue et une demande de justice.",
    },
  },
  {
    id: 5,
    slug: "visible-within",
    title: "Visible Within",
    collection: "Emotional Release",
    year: "2026",
    medium: "Thread on Canvas",
    dimensions: "8 × 10 inches",
    originalPrice: 200,
    printOptions: [],
    status: "Available",
    edition: "Original work",
    provenance: "Original catalogue work by Mary Adesakin Damilola.",
    image: "/artwork/visible-within.webp",
    description: {
      en: "This work depicts the eye as the window of the soul, using thread to materialize emotional release. Turquoise strands transform tears into a symbol of healing rather than fragility.",
      yo: "Iṣẹ́ yìí lo ojú gẹ́gẹ́ bí fèrèsé ọkàn, pẹ̀lú òkùn tí ó sọ omijé di àmì ìwòsàn.",
      fr: "Cette œuvre présente l'œil comme une fenêtre de l'âme, transformant les larmes en signe de guérison.",
    },
  },
  {
    id: 6,
    slug: "hands-that-wont-let-go",
    title: "Hands That Won’t Let Go",
    collection: "Guidance and Control",
    year: "2026",
    medium: "Mixed Media (Thread and Acrylic on Canvas)",
    dimensions: "36 × 36 inches",
    originalPrice: 2500,
    printOptions: [{ size: "10 × 12 inches", price: 100 }],
    status: "Available",
    edition: "Original work",
    provenance: "Original portfolio work by Mary Adesakin Damilola.",
    image: "/artwork/hands-that-wont-let-go.webp",
    description: {
      en: "A violinist held by multiple hands, tracing the fragile line between guidance, inherited pressure, and the desire for self-expression.",
      yo: "Olórin violin tí ọwọ́ púpọ̀ dì mú, làárín ìtọ́jú, ìpá, àti ìfẹ́ láti sọ ara rẹ̀ hàn.",
      fr: "Une violoniste tenue par plusieurs mains, entre guidance, pression héritée et expression de soi.",
    },
  },
  {
    id: 7,
    slug: "the-ife-muse",
    title: "The Ife Muse",
    collection: "Yoruba Heritage",
    year: "2026",
    medium: "Thread and Acrylic on Canvas",
    dimensions: "21 × 26 inches",
    originalPrice: 1200,
    printOptions: [{ size: "10 × 12 inches", price: 100 }],
    status: "Available",
    edition: "Original work",
    provenance: "Original portfolio work by Mary Adesakin Damilola.",
    image: "/artwork/the-ife-muse.webp",
    description: {
      en: "Inspired by ancient Ife bronze heads, this portrait reconnects facial markings, memory, and Yoruba heritage through thread.",
      yo: "Iṣẹ́ yìí ní ìmísí láti orí idẹ Ifẹ̀ àtijọ́, tí ó so ìrántí àti àsà Yorùbá pọ̀ pẹ̀lú òkùn.",
      fr: "Inspirée par les têtes de bronze d'Ife, cette œuvre relie mémoire, marques faciales et héritage yoruba.",
    },
  },
  {
    id: 8,
    slug: "beauty-in-becoming",
    title: "Beauty in Becoming",
    collection: "Becoming",
    year: "2026",
    medium: "Thread and Acrylic on Canvas",
    dimensions: "18 × 19 inches",
    originalPrice: 700,
    printOptions: [{ size: "10 × 12 inches", price: 70 }],
    status: "Available",
    edition: "Original work",
    provenance: "Original portfolio work by Mary Adesakin Damilola.",
    image: "/artwork/beauty-in-becoming.webp",
    description: {
      en: "A quiet portrait of identity, vulnerability, and growth, where thread lines and a rose hold space for resilience and renewal.",
      yo: "Àwòrán ìdákẹ́jẹ́ nípa ìdánimọ̀, ìdàgbàsókè, àti agbára láti tún ara ṣe.",
      fr: "Un portrait calme sur l'identité, la vulnérabilité, la croissance et le renouveau.",
    },
  },
  {
    id: 10,
    slug: "the-calm-before-clarity",
    title: "The Calm Before Clarity",
    collection: "Maze of Uncertainty",
    year: "2025",
    medium: "Mixed Media (Thread and Acrylic on Canvas)",
    dimensions: "20 × 24 inches",
    originalPrice: 1000,
    printOptions: [{ size: "10 × 12 inches", price: 100 }],
    status: "Available",
    edition: "Original work",
    provenance: "Original portfolio work by Mary Adesakin Damilola.",
    image: "/artwork/the-calm-before-clarity.webp",
    description: {
      en: "A contemplative gaze held within shifting colour, approaching uncertainty as a space for reflection, resilience, and possibility.",
      yo: "Wíwo inú nínú àwọn àwọ̀ tí ń yípadà, ń rí àìdánilójú gẹ́gẹ́ bí aaye èrò àti ìrètí.",
      fr: "Un regard contemplatif dans des couleurs mouvantes, où l'incertitude devient espace de résilience.",
    },
  },
  {
    id: 11,
    slug: "rare-like-a-blue-rose",
    title: "Rare Like a Blue Rose",
    collection: "Becoming",
    year: "2026",
    medium: "Mixed Media (Thread and Acrylic on Canvas)",
    dimensions: "17 × 17 inches",
    originalPrice: 900,
    printOptions: [{ size: "10 × 12 inches", price: 70 }],
    status: "Available",
    edition: "Original work",
    provenance: "Original portfolio work by Mary Adesakin Damilola.",
    image: "/artwork/rare-like-a-blue-rose.webp",
    description: {
      en: "A vivid affirmation of self-possession: finding light within and letting it shine fully, whatever the odds.",
      yo: "Ìfihàn ti ìgboyà àti ìmọ́lẹ̀ inú, pẹ̀lú agbára láti tàn ní kíkún.",
      fr: "Une affirmation vive de la possession de soi et de la lumière intérieure.",
    },
  },
  {
    id: 12,
    slug: "the-weight",
    title: "The Weight We Carry",
    collection: "Early Thread Narratives",
    year: "2024",
    medium: "Threadcollage and Acrylic on Canvas",
    dimensions: "16 × 20 inches",
    originalPrice: null,
    printOptions: [{ size: "10 × 12 inches", price: 100 }],
    status: "Sold",
    edition: "Original work",
    provenance: "Sold catalogue work by Mary Adesakin Damilola.",
    image: "/artwork/in-her-prime.webp",
    description: {
      en: "Sold original work from Mary Adesakin's 2024 catalogue.",
      yo: "Iṣẹ́ àtilẹ̀bá tí ta láti kátálọ́gì Mary Adesakin 2024.",
      fr: "Œuvre originale vendue du catalogue 2024 de Mary Adesakin.",
    },
  },
  {
    id: 13,
    slug: "in-her-prime",
    title: "In Her Prime",
    collection: "Early Thread Narratives",
    year: "2024",
    medium: "Threadcollage and Acrylic on Canvas",
    dimensions: "16 × 20 inches",
    originalPrice: null,
    printOptions: [{ size: "10 × 12 inches", price: 100 }],
    status: "Sold",
    edition: "Original work",
    provenance: "Sold catalogue work by Mary Adesakin Damilola.",
    image: "/artwork/in-her-prime-green.webp",
    description: {
      en: "Sold original work from Mary Adesakin's 2024 catalogue, centered on women's education, service, and the fullness of feminine becoming.",
      yo: "Iṣẹ́ tí ta, nípa ẹ̀kọ́ obìnrin, iṣẹ́ ìrànlọ́wọ́, àti ìdàgbàsókè obìnrin.",
      fr: "Œuvre vendue sur l'éducation des femmes, le service et le devenir féminin.",
    },
  },
  {
    id: 15,
    slug: "stitched-in-time",
    title: "Stitched in Time",
    collection: "Yoruba Heritage",
    year: "2025",
    medium: "Thread and Acrylic on Canvas",
    dimensions: "18 × 22 inches",
    originalPrice: null,
    printOptions: [{ size: "10 × 12 inches", price: 100 }],
    status: "Sold",
    edition: "Original work",
    provenance: "Sold catalogue work by Mary Adesakin Damilola.",
    image: "/artwork/stitched-in-time.webp",
    description: {
      en: "Inspired by the Olojo Festival in Ile-Ife, this work reimagines the spiritual and ancestral resonance of bata drum traditions.",
      yo: "Ìmísí láti Ọdún Olójó ní Ilé-Ifẹ̀, tí ó tún ro ohùn bàtá àti ìrántí àwọn baba ńlá.",
      fr: "Inspirée par le festival Olojo d'Ile-Ife, cette œuvre réimagine les traditions du tambour bata.",
    },
  },
];

export const collections = [
  ...new Set(artworks.map((work) => work.collection)),
];

export function getArtwork(slug: string) {
  return artworks.find((work) => work.slug === slug);
}

export function relatedWorks(slug: string, limit = 3) {
  const current = getArtwork(slug);
  if (!current) return artworks.slice(0, limit);
  const same = artworks.filter(
    (work) => work.slug !== slug && work.collection === current.collection,
  );
  const rest = artworks.filter(
    (work) => work.slug !== slug && work.collection !== current.collection,
  );
  return [...same, ...rest].slice(0, limit);
}

export const featuredSlug = "the-weight-of-words";
export const heroSlug = "the-ife-muse";
