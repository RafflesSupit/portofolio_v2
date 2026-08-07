export const profile = {
  name: "Raffles Supit",
  role: "Backend Engineer",
  eyebrow: "Available for opportunities",
  headline: "Backend Engineer building systems that scale.",
  subhead:
    "I design and ship RESTful APIs and distributed, microservice-based backends - from authentication and data modeling to gateways that keep independent services talking cleanly.",
  bio: [
    "I'm a backend engineer who enjoys the part of software most people don't see: the services, data models, and integrations that keep a product reliable as it grows. My work spans building RESTful APIs, structuring microservice architectures, and wiring authentication and authorization end to end.",
    "Currently an IT Business Integration Intern at PT Sumber Alfaria Trijaya, Tbk., where I work on migrating a business-critical merchant application off Oracle Forms while building its new backend logic in Python and MongoDB. Outside of that, I've built a news portal and an e-commerce backend from the ground up - both structured as independent, deployable services rather than a single monolith.",
    "I also spent a year and a half as a teaching assistant at FTI UKSW, helping students work through programming fundamentals, algorithms, data structures, and networking - which sharpened how I explain and reason about systems, not just build them.",
  ],
  email: "rafflessupit25@gmail.com",
  socials: {
    github: "https://github.com/RafflesSupit",
    linkedin: "https://www.linkedin.com/in/raffles-agustinus-supit/",
    email: "mailto:rafflessupit25@gmail.com",
  },
  location: "Salatiga, Indonesia",
  resumeUrl: "/files/CV_Raffles_Agustinus_Supit.pdf",
};

export const skills = [
  {
    category: "Languages",
    items: ["PHP", "Python", "Java", "JavaScript"],
  },
  {
    category: "Frameworks",
    items: ["Laravel", "Spring Boot", "Spring Security"],
  },
  {
    category: "Databases",
    items: ["PostgreSQL", "MongoDB"],
  },
  {
    category: "Architecture",
    items: [
      "RESTful API Design",
      "Microservices",
      "API Gateway",
      "Service Discovery",
    ],
  },
  {
    category: "Auth & Integration",
    items: ["JWT", "Axios", "OAuth-style Auth Flows"],
  },
  {
    category: "Practice",
    items: ["Debugging & Testing", "Code Review", "Audit Logging"],
  },
];

export type Project = {
  slug: string;
  title: string;
  type: string;
  role: string;
  year: string;
  description: string;
  highlights: string[];
  tags: string[];
  /** TODO: replace with the real repo/demo URL for this project. */
  href: string;
  image: string;
};

export const projects: Project[] = [
  {
    slug: "newshub",
    title: "NewsHub - News Portal Web App",
    type: "Web App",
    role: "Backend Engineer",
    year: "2025",
    description:
      "A microservice-based news portal split into independent services for authentication, article management, categories, and user administration.",
    highlights: [
      "Developed RESTful APIs with Laravel and PHP - CRUD operations, request validation, and authentication across services.",
      "Modeled and integrated the data layer with PostgreSQL for each independent service.",
      "Connected frontend and backend services through an API Gateway using Axios for smooth inter-service communication.",
    ],
    tags: ["Laravel", "PHP", "PostgreSQL", "Microservices", "API Gateway", "Axios"],
    href: "https://github.com/RafflesSupit",
    image: "https://picsum.photos/seed/raffles-newshub/640/800",
  },
  {
    slug: "ecommerce-platform",
    title: "E-Commerce Platform",
    type: "Web App",
    role: "Backend Engineer",
    year: "2025",
    description:
      "A microservices backend supporting a full commerce flow - from product browsing to order completion - designed for scale and maintainability.",
    highlights: [
      "Architected scalable, distributed services with Spring Boot, an API Gateway, and service discovery.",
      "Implemented secure authentication and authorization with Spring Security and JWT.",
      "Integrated backend services to keep ordering, payment, and shipping flows consistent end to end.",
    ],
    tags: ["Spring Boot", "Java", "JWT", "Spring Security", "Microservices", "MongoDB", "Service Discovery"],
    href: "https://github.com/RafflesSupit",
    image: "https://picsum.photos/seed/raffles-ecommerce/640/800",
  },
];

export type ExperienceItem = {
  role: string;
  org: string;
  period: string;
  points: string[];
};

export const experience: ExperienceItem[] = [
  {
    role: "IT Business Integration Intern",
    org: "PT Sumber Alfaria Trijaya, Tbk.",
    period: "Sep 2025 - Aug 2026",
    points: [
      "Participating in the migration of the Master Merchant Cash application from Oracle Forms to an internal framework.",
      "Developing backend APIs and business logic with Python and MongoDB - CRUD operations, validation, and audit logging.",
      "Implementing frontend functionality in JavaScript, including dynamic forms, custom actions, and searchable data tables.",
      "Debugging, testing, and refining the application to improve system stability and user experience.",
    ],
  },
  {
    role: "Teaching Assistant",
    org: "FTI UKSW Salatiga",
    period: "Jan 2024 - Jun 2025",
    points: [
      "Helped students understand core concepts and practical application in Programming Fundamentals, Algorithms, Data Structures, Computer Networking Fundamentals, and Artificial Intelligence.",
      "Provided one-on-one and group guidance to clarify programming and computing theory.",
      "Supported lecturers in preparing course materials, grading assignments and exams, and running review sessions.",
    ],
  },
  {
    role: "Committee Member",
    org: "FIT International Competition 2025",
    period: "Mar 2025 - Aug 2025",
    points: [
      "Managed the planning and execution of a national and international programming competition.",
      "Built a comprehensive event schedule to keep the competition running smoothly end to end.",
      "Coordinated with organizers, judges, participants, and sponsors to ensure smooth operations.",
    ],
  },
];
