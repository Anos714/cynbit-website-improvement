export const homeContent = {
  title: "Architecting what's next.",
  introduction:
    "Cynbit is the Jaipur studio engineering AI automation, software and cloud systems for teams with a bigger horizon. One senior team, from first blueprint to production.",
  facts: [
    { label: "Studio", value: "Jaipur, India" },
    { label: "Building since", value: "2024" },
    { label: "Public case studies", value: "13" },
    { label: "Proprietary products", value: "3" },
  ],
  principles: [
    {
      title: "Think in systems",
      body: "We design the relationships between data, people and software before we write a line of code.",
    },
    {
      title: "Build for the second year",
      body: "The launch is the start. We optimise for maintainability, clarity and the roadmap you have not written yet.",
    },
    {
      title: "Keep the team close",
      body: "The people in the room are the people doing the work. Senior attention is not a phase of the project.",
    },
  ],
  process: [
    {
      title: "Discover the real constraint",
      description:
        "We map workflows, technical debt and the business outcome at stake before proposing a build.",
    },
    {
      title: "Draw the architecture",
      description:
        "A practical roadmap for data, interfaces, AI and infrastructure, with decisions documented in plain language.",
    },
    {
      title: "Design the experience",
      description:
        "Complex systems made legible: flows, interfaces and content that help people move with confidence.",
    },
    {
      title: "Engineer the system",
      description:
        "Small, reviewable increments, tested against the real use case rather than a polished demo.",
    },
    {
      title: "Prove it under pressure",
      description:
        "Accessibility, security and performance are verified before launch, not retrofitted after it.",
    },
    {
      title: "Stay accountable",
      description:
        "We monitor, measure and improve after release, with a clear handover path when you are ready.",
    },
  ],
} as const;

export const teamMembers = [
  {
    slug: "mohak-saini",
    name: "Mohak Saini",
    title: "Founder & CEO",
    image: "/images/team/mohak.webp",
    bio: "Leads technical strategy and systemic design across Cynbit's product and client ecosystem.",
    focus: "Strategy, architecture, product",
  },
  {
    slug: "ashutosh-upadhyay",
    name: "Ashutosh Upadhyay",
    title: "Co-founder",
    image: "/images/team/ashutosh.webp",
    bio: "Shapes intuitive product architecture while keeping technical integrity visible in every decision.",
    focus: "Product, interface systems, delivery",
  },
  {
    slug: "dhawan-nama",
    name: "Dhawan Nama",
    title: "Co-founder & CTO",
    image: "/images/team/dhawan.webp",
    bio: "Builds the partnerships and technical foundations that help Cynbit work beyond its home market.",
    focus: "Engineering, partnerships, scale",
  },
] as const;

export const teamValues = [
  {
    title: "Radical integrity",
    description: "Technical and ethical transparency, especially when a simpler answer is inconvenient.",
  },
  {
    title: "Proven rigor",
    description: "A documented approach to complex systems, not a performance of confidence.",
  },
  {
    title: "A collaborative hub",
    description: "No single point of failure. Context is shared, decisions are traceable and work is reviewable.",
  },
] as const;

export type ServicePractice = {
  id: string;
  title: string;
  summary: string;
  services: { title: string; description: string }[];
  tone: "mint" | "sky" | "peach";
};

export const servicePractices: ServicePractice[] = [
  {
    id: "ai-automation",
    title: "AI automation",
    summary:
      "Beyond a chatbot bolted onto a workflow. We design autonomous systems that take on real operational work, with guardrails you can explain.",
    tone: "mint",
    services: [
      {
        title: "Autonomous agents",
        description: "AI assistants that manage leads, coordination and repeatable operational decisions.",
      },
      {
        title: "LLM automation",
        description: "Document handling, extraction and data entry built around your actual process.",
      },
      {
        title: "Voice agents",
        description: "Natural voice workflows for support, qualification and high-volume coordination.",
      },
      {
        title: "AI stack integration",
        description: "Intelligence embedded into the tools your team already uses, not another tab.",
      },
    ],
  },
  {
    id: "software",
    title: "Software engineering",
    summary:
      "High-performance web, mobile and platform engineering. We build the resilient core that lets a business change without falling over.",
    tone: "sky",
    services: [
      {
        title: "Full-stack development",
        description: "Scalable web and mobile products with a coherent design and engineering language.",
      },
      {
        title: "Backend systems",
        description: "Secure APIs, data models and services designed for observability and growth.",
      },
      {
        title: "Cloud infrastructure",
        description: "Pragmatic AWS and Azure architecture with security boundaries built in.",
      },
      {
        title: "Legacy modernisation",
        description: "Incremental migration of monoliths into systems your team can safely evolve.",
      },
    ],
  },
  {
    id: "growth",
    title: "Growth engineering",
    summary:
      "Technical SEO, content systems and conversion work that compounds. Marketing built on the same evidence as the product.",
    tone: "peach",
    services: [
      {
        title: "Performance advertising",
        description: "Google and Meta campaigns tied to a measurement model that reflects the business.",
      },
      {
        title: "Technical SEO",
        description: "Crawlability, structured data, Core Web Vitals and information architecture, handled properly.",
      },
      {
        title: "CRM automation",
        description: "Lifecycle systems that turn fragmented interest into a visible, useful pipeline.",
      },
      {
        title: "Funnel optimisation",
        description: "Research-led landing pages and journeys tested against real user behaviour.",
      },
    ],
  },
];

export const technologyGroups = [
  { title: "Languages", items: ["TypeScript", "Python", "Go", "Rust", "Java", "C++"] },
  { title: "Frameworks", items: ["React", "Next.js", "NestJS", "FastAPI", "Django", "Tailwind"] },
  { title: "AI & data", items: ["OpenAI", "LangChain", "PyTorch", "TensorFlow", "Pinecone", "Spark"] },
  { title: "Cloud & ops", items: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform", "CI/CD"] },
  { title: "Databases", items: ["PostgreSQL", "MongoDB", "Redis", "Prisma", "Supabase", "Neo4j"] },
] as const;

export type Product = {
  slug: string;
  name: string;
  monogram: string;
  category: string;
  tagline: string;
  description: string;
  features: { title: string; description: string }[];
  quote: string;
  tone: "mint" | "sky" | "peach";
};

export const products: Product[] = [
  {
    slug: "cynbit-studio",
    name: "Cynbit Studio",
    monogram: "CS",
    category: "Career intelligence",
    tagline: "Not just another coding platform.",
    description:
      "Cynbit Studio helps students and developers move from learning to employability through adaptive coding paths, AI-evaluated missions and career tools that make progress visible.",
    tone: "sky",
    features: [
      {
        title: "Adaptive learning paths",
        description: "A placement assessment shapes the route, then the platform adjusts to pace and evidence.",
      },
      {
        title: "AI code review",
        description: "Feedback on code quality and reasoning, not just whether the output matched.",
      },
      {
        title: "Career proof",
        description: "Skill radar, XP, certificates and resume generation bring effort into the open.",
      },
      {
        title: "Interview practice",
        description: "A companion for mentoring, evaluation and technical interview preparation.",
      },
    ],
    quote: "What if the platform knew where you stand, challenged you at the right level, and helped you show it?",
  },
  {
    slug: "tenantease",
    name: "TenantEase",
    monogram: "TE",
    category: "Property operations",
    tagline: "Run the property, not the notebook.",
    description:
      "A single system for property managers to track units, tenants, rent and dues without reconstructing the truth from scattered chats and spreadsheets.",
    tone: "mint",
    features: [
      {
        title: "Unit visibility",
        description: "Buildings and rooms with availability, occupancy and tenancy history in one place.",
      },
      {
        title: "Tenant profiles",
        description: "Structured records for identity, contacts and history, kept secure and current.",
      },
      {
        title: "Rent intelligence",
        description: "Monthly rent, transactions and pending dues with system-driven reminders.",
      },
      {
        title: "Operating dashboard",
        description: "Occupancy and revenue context for decisions, not decorative charts.",
      },
    ],
    quote: "Run your property business without the chaos of notebooks and scattered chats.",
  },
  {
    slug: "revio",
    name: "Revio",
    monogram: "RV",
    category: "Reputation intelligence",
    tagline: "Every location, understood.",
    description:
      "Revio is an AI-first reputation engine for multi-location businesses: reviews synced, sentiment analysed, and responses drafted without losing the brand's voice.",
    tone: "peach",
    features: [
      {
        title: "AI review sync",
        description: "Feedback from Google, social platforms and industry sites brought into one queue.",
      },
      {
        title: "Sentiment analysis",
        description: "See which locations need attention and which themes recur across the brand.",
      },
      {
        title: "Response assistance",
        description: "Professional replies drafted with context, reviewable before they go public.",
      },
      {
        title: "Location hierarchy",
        description: "Role-based access for global admins, brand managers and location advisors.",
      },
    ],
    quote: "A centralised ecosystem for the modern, reputation-driven business.",
  },
];

export const specialisations = [
  {
    title: "Full-stack development",
    description: "The whole lifecycle, from interface decisions to robust back-end systems.",
  },
  {
    title: "Data science & AI",
    description: "Turning raw data into predictive intelligence and autonomous solutions.",
  },
  {
    title: "Cloud architecture",
    description: "Scaling infrastructure with AWS, Azure and modern DevOps practice.",
  },
  {
    title: "Digital marketing",
    description: "Technical SEO, content and paid growth for the digital-first era.",
  },
] as const;

export const studentVoices = [
  { name: "Aadish Jain", college: "SKIT", quote: "Thinking in systems, not just code." },
  { name: "Paramveer Singh Bhati", college: "Poornima", quote: "Treatment like a real engineer." },
  { name: "Divyansh Bhati", college: "JECRC", quote: "Changed my career trajectory." },
  { name: "Kuldeep Suthar", college: "Arya College", quote: "Absolute game changer." },
  { name: "Vishwa Khandelwal", college: "SKIT", quote: "Mastered cloud at my own pace." },
  { name: "Naitik Sharma", college: "Arya College", quote: "Always challenged correctly." },
] as const;

export const learningDimensions = [
  { id: "full-stack", name: "Full-stack web", cluster: "Build", description: "Interfaces, APIs and the systems between them." },
  { id: "ui-ux", name: "UI/UX design", cluster: "Build", description: "Research, flows, interaction and accessible interface craft." },
  { id: "devops", name: "DevOps", cluster: "Build", description: "Delivery pipelines, reliability and operational calm." },
  { id: "cybersecurity", name: "Cybersecurity", cluster: "Build", description: "Threat modelling and resilient application security." },
  { id: "ai", name: "Artificial intelligence", cluster: "Intelligence", description: "Models, agents and applied AI product thinking." },
  { id: "ml", name: "Machine learning", cluster: "Intelligence", description: "Training, evaluation and useful prediction." },
  { id: "deep-learning", name: "Deep learning", cluster: "Intelligence", description: "Neural systems and modern model architectures." },
  { id: "nlp", name: "Natural language", cluster: "Intelligence", description: "Language systems, embeddings and retrieval." },
  { id: "data-science", name: "Data science", cluster: "Intelligence", description: "Statistical reasoning and evidence-led decisions." },
  { id: "analytics", name: "Data analytics", cluster: "Intelligence", description: "Make operational data legible and useful." },
  { id: "cloud", name: "Cloud computing", cluster: "Infrastructure", description: "AWS, Azure and GCP across real deployment patterns." },
  { id: "blockchain", name: "Blockchain", cluster: "Infrastructure", description: "Distributed systems, trust and responsible application." },
  { id: "iot", name: "Internet of things", cluster: "Infrastructure", description: "Connected devices and the data they produce." },
  { id: "marketing", name: "Digital marketing", cluster: "Growth", description: "Search, content and a measurement model that holds up." },
  { id: "social", name: "Social media", cluster: "Growth", description: "Community, distribution and brand voice." },
  { id: "business-analytics", name: "Business analytics", cluster: "Growth", description: "Translate commercial questions into technical work." },
] as const;

export const careerBenefits = [
  {
    title: "Continuous learning",
    description: "Certifications, conferences and research time for stacks that matter to the work.",
  },
  {
    title: "Radical flexibility",
    description: "Remote-first delivery balanced with deliberate time together for architecture and planning.",
  },
  {
    title: "High-impact ownership",
    description: "Every person can influence the technical blueprint and the product roadmap, not just their queue.",
  },
  {
    title: "A useful mission",
    description: "Client work and BitElevate share the same goal: make difficult technical capability more accessible.",
  },
] as const;

export const operatingModel = [
  {
    title: "Documented context",
    description: "Decisions live in the open. Meetings are for judgement, not for recreating information.",
  },
  {
    title: "Asynchronous by default",
    description: "Deep work is protected. Synchronous time is reserved for the questions that need a room.",
  },
  {
    title: "Generous review",
    description: "Critique is about the work and the outcome. The standard is the best architecture, not the loudest voice.",
  },
  {
    title: "Measured pace",
    description: "We ship in reviewable increments and refuse to trade long-term quality for theatrical urgency.",
  },
] as const;

export const impactProgrammes = [
  {
    title: "Technical capability",
    description:
      "Helping students become professionally capable through practical workshops, technical training and industry exposure.",
    items: ["Technical training", "Career readiness", "Practical learning", "Industry exposure"],
  },
  {
    title: "Holistic well-being",
    description:
      "Addressing the emotional side of student life through mental health, stress management and academic pressure support.",
    items: ["Mental wellness", "Emotional health", "Safe spaces", "Confidence"],
  },
] as const;

export const contactFaq = [
  {
    question: "How does a project start?",
    answer:
      "Send us a short note about the problem, the outcome you need and any constraints. We will reply with next steps or a discovery call. No obligation, no high-pressure sales choreography.",
  },
  {
    question: "Do you build custom AI systems?",
    answer:
      "Yes. We build AI agents, LLM-backed workflows, voice agents and intelligent document systems around a specific operational job, with security and human review designed in.",
  },
  {
    question: "Where is Cynbit based?",
    answer:
      "Our studio is in Pratap Nagar, Jaipur, Rajasthan. We work with teams across time zones and use asynchronous collaboration deliberately.",
  },
  {
    question: "Can I apply to BitElevate?",
    answer:
      "Yes. BitElevate runs as an educational programme within Cynbit. Start with the learning paths page, then contact the team about the next cohort or an open internship.",
  },
] as const;

export const contactChannels = {
  business: "opportunities@cynbit.in",
  support: "support@cynbit.in",
  phones: ["+91 89479 62667", "+91 78912 09777", "+91 83023 37367"],
  address: "32/115 Pratap Nagar, Jaipur, Rajasthan 302033",
} as const;

export const legalPages = {
  privacy: {
    title: "Privacy policy",
    updated: "20 May 2026",
    intro:
      "Our commitment to data sovereignty is simple: collect less, explain why, and protect what you choose to share.",
    sections: [
      {
        title: "Data sovereignty",
        body: [
          "We collect the minimum information necessary to provide our services. That typically means your name, email and professional context when you choose to contact us.",
          "We do not sell, rent or trade personal information for marketing purposes.",
        ],
      },
      {
        title: "How we use information",
        body: [
          "Information submitted through inquiry forms, newsletter sign-up or job applications is used to respond to that request and keep the relevant record.",
          "We use secure processors for delivering email and operating the site. Their access is limited to the service they provide.",
        ],
      },
      {
        title: "Security standards",
        body: [
          "The site is delivered over HTTPS with security headers and a restricted content security policy. Form submissions are validated, rate-limited and protected against automated abuse.",
          "No system is perfect. If you believe you have found a security issue, contact us with enough detail to reproduce it, without accessing or modifying other people's data.",
        ],
      },
      {
        title: "Your rights",
        body: [
          "You can ask for a copy of the information we hold about you, request a correction, or ask us to delete it.",
          `To make a request, email ${"opportunities@cynbit.in"}. We may need to verify that the request relates to you before acting on it.`,
        ],
      },
    ],
  },
  terms: {
    title: "Terms of service",
    updated: "20 May 2026",
    intro:
      "The practical terms for using this website. The short version: read the work, share the links, and do not submit another person's information without their permission.",
    sections: [
      {
        title: "Agreement to terms",
        body: [
          "By accessing this website, you agree to these terms. If you do not agree, please stop using the site.",
          "We may update the site or these terms. The date at the top of this page shows the current version.",
        ],
      },
      {
        title: "Intellectual property",
        body: [
          "Site copy, design, original code, case study text and brand assets belong to Cynbit Technologies unless stated otherwise.",
          "You may link to public pages and quote short excerpts with attribution. Reproduction of substantial content, brand assets or code for commercial use requires written permission.",
        ],
      },
      {
        title: "Service inquiries",
        body: [
          "Submitting an inquiry does not create a contract for services. A binding agreement only exists when both parties sign a statement of work or equivalent written agreement.",
          "Project timelines, pricing and deliverables are specific to that agreement, not to general content on this website.",
        ],
      },
      {
        title: "BitElevate programme",
        body: [
          "BitElevate participation is subject to selection, availability and programme conduct requirements. Programme details can change between cohorts.",
          "Student stories and testimonials are published with consent and may be edited for length without changing their meaning.",
        ],
      },
      {
        title: "Limitation of liability",
        body: [
          "The website is provided as a public information resource. To the extent permitted by law, Cynbit Technologies is not liable for indirect or consequential loss arising from use of the site.",
          "Nothing in these terms limits rights that cannot legally be limited.",
        ],
      },
    ],
  },
  cookies: {
    title: "Cookie policy",
    updated: "20 May 2026",
    intro:
      "This site is deliberately restrained with cookies. We use only what the experience requires and document it here.",
    sections: [
      {
        title: "What we use",
        body: [
          "Essential security and delivery cookies may be set by the hosting platform to keep the site available and protect forms from abuse.",
          "If analytics are enabled, they are configured to avoid advertising profiles and are not loaded until needed. This rebuild does not ship Google Analytics by default.",
        ],
      },
      {
        title: "What we do not use",
        body: [
          "We do not use cross-site advertising cookies to follow you around the internet.",
          "We do not sell cookie data or use it to infer sensitive personal information.",
        ],
      },
      {
        title: "Managing cookies",
        body: [
          "You can clear or block cookies in your browser settings. Blocking essential storage may prevent forms from working correctly.",
          "Questions about a specific cookie can be sent to opportunities@cynbit.in.",
        ],
      },
    ],
  },
} as const;
