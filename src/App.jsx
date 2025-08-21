import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Linkedin,
  Home,
  Rss,
  Calendar,
  Moon,
  Sun,
  ArrowUpRight,
  Globe,
  ChevronDown,
  Notebook,
} from "lucide-react";

/* ------------------------------ Helpers -------------------------------- */
const cx = (...classes) => classes.filter(Boolean).join(" ");

// Minimal X icon (so we don’t import images or external libs)
function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M3 3l7.7 9.2L3 21h3.7l6-7.2L18.9 21H21l-7.7-9.2L21 3h-3.7l-5.9 7L5.1 3H3z"
        fill="currentColor"
      />
    </svg>
  );
}

const Section = ({ id, title, children }) => (
  <section
    id={id}
    className="max-w-5xl mx-auto px-5 sm:px-8 md:px-10 lg:px-12 w-full"
  >
    <h2 className="text-neutral-900 dark:text-neutral-100 text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 sm:mb-6">
      {title}
    </h2>
    <div className="text-neutral-700 dark:text-neutral-300 text-base sm:text-lg leading-relaxed">
      {children}
    </div>
  </section>
);


const Card = ({
  as: Tag = "div",
  className = "",
  hover = true,
  children,
  ...props
}) => (
  <Tag
    className={cx(
      "rounded-2xl p-4 sm:p-5 bg-white/90 dark:bg-neutral-900/60 ring-1 ring-black/10 dark:ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
        hover && "hover:ring-black/20 dark:hover:ring-white/20 hover:bg-black/5 dark:hover:bg-neutral-900/80 transition",
      className
    )}
    {...props}
  >
    {children}
  </Tag>
);

/* -------------------------------- Data --------------------------------- */
const EXPERIENCES = [
  { company: "MarkupX", role: "Founding Engineer", start: "Aug 2025", end: "Present", logo: "🧩", details: "Led core platform, shipped multi-tenant infra, observability, and CI/CD." },
  { company: "Modulus", role: "Founding Full-Stack Engineer", start: "Apr 2025", end: "Aug 2025", logo: "🟢", details: "Built dashboard, auth, and payments. Reduced TTFB by 35%." },
  { company: "Showtime", role: "Backend Engineer Intern", start: "Feb 2025", end: "Jun 2025", logo: "🍿", details: "Designed queue-based ingestion, added metrics & alerts." },
  { company: "Code Inbound", role: "Frontend Engineer", start: "Sep 2024", end: "Feb 2025", logo: "🧠", details: "Implemented design system and SSR routing, improved LCP." },
];


const BLOG_POSTS = [
  {
    slug: "shipping-fast-with-genai",
    title: "Shipping Fast with GenAI: Patterns that Actually Scale",
    date: "2025-07-14",
    tags: ["GenAI", "Systems"],
    excerpt:
      "A practical set of patterns for building durable GenAI products: isolation layers, cache hierarchies, evals, and zero-downtime rollout.",
  },
  {
    slug: "aws-for-founders",
    title: "AWS for Founding Engineers: Bills Low, Throughput High",
    date: "2025-06-02",
    tags: ["AWS", "Infra"],
    excerpt:
      "Terraform-lite, EKS vs ECS, spot fleets, and a reference stack that keeps you fast without burning $$$.",
  },
  {
    slug: "frontend-at-scale",
    title: "Frontend at Scale: State, Performance, and DX",
    date: "2025-05-10",
    tags: ["Frontend", "DX"],
    excerpt:
      "From signals to caches to suspense: modern patterns that keep large apps snappy and maintainable.",
  },
];

const PROJECTS = [
  {
    title: "Supereddit - AI Reddit Automation Platform",
    timeline: "June 2025 – July 2025",
    description:
      "Built a multi-tenant SaaS for Reddit automation with an AI content engine, smart scheduling, and real-time keyword tracking. Powered by a producer–consumer backend and a Next.js dashboard.",
    video: "https://player.vimeo.com/video/256412595", // <-- replace with your Vimeo URL
    tech: [
      "Next.js",
      "Node.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "AWS",
      "Docker",
      "GenAI (LangChain)",
      "WebSockets",
      "Recharts",
    ],
    website: "https://example.com",            // <-- your live link
    source: "https://github.com/you/supereddit" // <-- your repo
  },
  {
    title: "Safire - AI Harassment Detection Platform",
    timeline: "Jan 2025 – Feb 2025",
    description:
      "Created a real-time AI platform that spots and tackles online harassment, with automated evidence capture and an easy-to-use dashboard for live insights.",
    video: "https://player.vimeo.com/video/272151660", // <-- replace
    tech: ["Next.js", "RAG", "Redis", "Docker", "Node.js", "MongoDB", "Puppeteer", "Prisma"],
    website: "https://example.com",
    source: "https://github.com/you/safire"
  },
  {
    title: "E-commerce Store",
    timeline: "March 2025 – April 2025",
    description:
      "Full-stack store with payments & order tracking.",
    video: "https://player.vimeo.com/video/246115326", // <-- replace
    tech: ["Next.js", "RAG", "Redis", "Docker", "Node.js", "MongoDB", "Puppeteer", "Prisma"],
    website: "https://example.com",
    source: "https://github.com/you/safire"
  },
  {
    title: "AI Chatbot",
    timeline: "June 2025 – July 2025",
    description:
      "Conversational AI powered by OpenAI APIs.",
    video: "https://player.vimeo.com/video/414076311", // <-- replace
    tech: ["Next.js", "RAG", "Redis", "Docker", "Node.js", "MongoDB", "Puppeteer", "Prisma"],
    website: "https://example.com",
    source: "https://github.com/you/safire"
  }
  
];


/* -------------------------------- Views -------------------------------- */
function Hero() {
  return (
    <div className="max-w-5xl mx-auto w-full px-5 sm:px-8 md:px-10 lg:px-12 pt-10 sm:pt-14">
      <div className="flex items-start gap-6 sm:gap-10">
        <div className="flex-1">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.05]">
            Hi, I'm Raj 
          </h1>
          <p className="text-neutral-700 dark:text-neutral-300 mt-4 sm:mt-5 text-lg sm:text-xl max-w-2xl">
            Software Engineer scaling products to lakhs of users. 8x National
            Hackathon Winner / Finalist. Expert in Full Stack, AWS, and GenAI.
          </p>
        </div>

        {/* Avatar / Decorative */}
        <div className="hidden sm:block">
          <motion.div
            initial={{ rotate: -8, y: -6, opacity: 0 }}
            animate={{ rotate: 0, y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
            className="relative w-28 h-28 sm:w-32 sm:h-32"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-black/10 to-black/0 dark:from-white/15 dark:to-white/0 ring-1 ring-black/10 dark:ring-white/20" />
            <div className="absolute inset-[6px] rounded-2xl bg-white dark:bg-neutral-900 grid place-items-center text-5xl">
              👋🏻
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}


function About() {
  return (
    <Section id="about" title="About">
      <p>
        I'm a <span className="font-semibold">Founding Engineer</span> driven by building products that
        scale to <span className="font-semibold">lakhs of users</span>. I've shipped over
        <span className="font-semibold"> 10 commercial projects</span> and have consistently placed as a
        <span className="font-semibold"> winner or finalist in 8 national hackathons</span>, a testament to my ability to
        deliver creative, <span className="font-semibold">high-impact solutions under extreme pressure</span>.
        My mission is to architect <span className="font-semibold">scalable, production-grade software</span>
        from ambitious ideas.
      </p>
    </Section>
  );
}

function ExperienceItem({ e, isOpen, onToggle }) {
  return (
    <Card
      className={cx(
        "cursor-pointer transition-colors",
        isOpen && "ring-black/20 dark:ring-white/20"
      )}
      onClick={onToggle}
      role="button"
      aria-expanded={isOpen}
    >
      <div className="flex items-center gap-4">
        <div className="text-3xl select-none" aria-hidden>
          {e.logo}
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-neutral-900 dark:text-white truncate">
            {e.company}
          </div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
            {e.role}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
          <span>{e.start} - {e.end}</span>
          <ChevronDown
            className={cx(
              "w-4 h-4 transition-transform duration-500",
              isOpen ? "rotate-180" : "rotate-0"
            )}
          />
        </div>
      </div>

      {/* Smooth collapsible details */}
      <div
        className={cx(
          "grid transition-all duration-500 ease-out",
          isOpen ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0 mt-0"
        )}
      >
        <div className="overflow-hidden text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {e.details}
        </div>
      </div>
    </Card>
  );
}


function Experience() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="max-w-5xl mx-auto px-5 sm:px-8 md:px-10 lg:px-12 w-full mt-8 sm:mt-10">
      <h3 className="text-neutral-900 dark:text-neutral-100 text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 sm:mb-6">
        Work Experience
      </h3>

      <div className="grid gap-3 sm:gap-4">
        {EXPERIENCES.map((e, i) => (
          <ExperienceItem
            key={e.company + e.start}
            e={e}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
}



function Education() {
  const schools = [
    {
    name: "Maharaja Surajmal Institute of Technology",
    sub: "B.Tech, Information Technology (CGPA: 8.8)",
    period: "2023 - 2027",
    logo: "🎓",
    link: "https://www.msit.in",   // 👈 add link here
  },
  {
    name: "Geek Room MSIT Chapter",
    sub: "Head of Development (Community of 25,000+)",
    period: "Sept 2023 - Present",
    logo: "🧑‍💻",
    link: "https://geekroom.in",   // 👈 add link here
  },
  ];
  return (
    <section className="max-w-5xl mx-auto px-5 sm:px-8 md:px-10 lg:px-12 w-full mt-8 sm:mt-10">
      <h3 className="text-neutral-900 dark:text-neutral-100 text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 sm:mb-6">
        Education and Other
      </h3>
      <div className="grid gap-3 sm:gap-4">
        {schools.map((s) => (
  <a
    key={s.name}
    href={s.link}
    target="_blank"
    rel="noopener noreferrer"
    className="block"
  >
    <Card className="flex items-center gap-4 cursor-pointer transition hover:scale-[1.02] hover:shadow-lg">
      <div className="text-3xl select-none" aria-hidden>
        {s.logo}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-neutral-900 dark:text-white truncate">
          {s.name}
        </div>
        <div className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
          {s.sub}
        </div>
      </div>
      <div className="text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
        {s.period}
      </div>
    </Card>
  </a>
))}

      </div>
    </section>
  );
}


function Skills() {
  const skills = [
    "Next.js",
    "Node.js",
    "AWS",
    "GenAI",
    "LangChain",
    "RAG",
    "TypeScript",
    "Docker",
    "PostgreSQL",
    "Redis",
    "CI/CD (GitHub Actions)",
    "Prisma",
  ];
  return (
    <section className="max-w-5xl mx-auto px-5 sm:px-8 md:px-10 lg:px-12 w-full mt-8 sm:mt-10">
      <h3 className="text-neutral-900 dark:text-neutral-100 text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 sm:mb-6">
        Skills
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <span
            key={s}
            className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm bg-black/5 dark:bg-white/10 ring-1 ring-black/10 dark:ring-white/15 text-neutral-900 dark:text-neutral-100 shadow hover:scale-[1.03] transition"
          >
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ p }) {
  return (
    <Card className="p-0 overflow-hidden">
      {/* Vimeo preview */}
      <div className="aspect-video">
        <iframe
          src={`${p.video}?background=1&autoplay=1&muted=1&loop=1&autopause=0`}
          className="w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          loading="lazy"
          title={p.title}
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-white">
          {p.title}
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
          {p.timeline}
        </p>

        <p className="mt-2 text-neutral-700 dark:text-neutral-300">
          {p.description}
        </p>

        {/* Tech tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {p.tech.map((t) => (
            <span
              key={t}
              className="px-3 py-1 text-xs rounded-full bg-black/5 dark:bg-white/10 ring-1 ring-black/10 dark:ring-white/10 text-neutral-700 dark:text-neutral-300"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="mt-4 flex gap-3">
          {p.website && (
            <a
              href={p.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90"
            >
              <Globe size={16} />
              Website
            </a>
          )}
          {p.source && (
            <a
              href={p.source}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg ring-1 ring-black/10 dark:ring-white/10 hover:bg-black/5 dark:hover:bg-white/10"
            >
              <Github size={16} />
              Source
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}

function ProjectsSection() {
  return (
    <section className="max-w-5xl mx-auto px-5 sm:px-8 md:px-10 lg:px-12 w-full mt-8 sm:mt-12">
      <div className="text-center">
        <span
        className="inline-block px-8 py-3 rounded-xl text-2xl font-neutral 
        bg-neutral-900 text-white 
        dark:bg-white dark:text-neutral-900 
        ring-1 ring-black/10 dark:ring-white/15">
        My Projects
       </span>

      <h3 className="text-neutral-900 dark:text-neutral-100 text-5xl sm:text-6xl font-extrabold tracking-tight mt-8">
       Check out my latest work
       </h3>
       <p className="text-neutral-700 dark:text-neutral-400 mt-6 max-w-5xl mx-auto text-xl sm:text-2xl leading-relaxed">
         I’ve worked on a variety of projects, from simple websites to complex web apps. Here are a few favorites.
       </p>


      </div>

      <div className="grid gap-4 sm:gap-6 mt-6 sm:mt-8 md:grid-cols-2">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.title} p={p} />
        ))}
      </div>
    </section>
  );
}

function VenturesSection() {
  return (
    <section className="max-w-5xl mx-auto px-5 sm:px-8 md:px-10 lg:px-12 w-full mt-20 text-center">
      <span
        className="inline-block px-8 py-3 rounded-xl text-2xl font-neutral 
        bg-neutral-900 text-white 
        dark:bg-white dark:text-neutral-900 
        ring-1 ring-black/10 dark:ring-white/15">
        Independent Ventures & Wins
       </span>

      {/* Bigger heading */}
      <h3 className="text-neutral-900 dark:text-neutral-100 text-5xl sm:text-6xl font-extrabold tracking-tight mt-6">
        I love building things
      </h3>
      <p className="text-neutral-700 dark:text-neutral-400 mt-6 max-w-5xl mx-auto text-xl sm:text-2xl leading-relaxed">
         I've always loved the challenge of building and shipping fast, and for me, hackathons were the ultimate test.
        Being in over 20 national competitions taught me what it truly takes to turn a big idea into a real, working
        product over a single weekend. You learn to make smart calls on the fly and just focus on what's essential to
        get it done. That's how I learned to deliver under pressure, which led to 8 placements as a winner or finalist.
      </p>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="max-w-4xl mx-auto px-5 sm:px-8 md:px-10 lg:px-12 w-full mt-12 sm:mt-16 text-center">
      <span
        className="inline-block px-4 py-3 rounded-xl text-2xl font-neutral
        bg-neutral-900 text-white 
        dark:bg-white dark:text-neutral-900 
        ring-1 ring-black/10 dark:ring-white/15">
        Contact
       </span>

      {/* Heading */}
      <h2 className="text-neutral-900 dark:text-neutral-100 text-4xl sm:text-5xl font-extrabold tracking-tight mt-4">
        Get in Touch
      </h2>

      {/* Paragraph */}
      <p className="text-neutral-700 dark:text-neutral-400 mt-6 max-w-full sm:max-w-3xl mx-auto 
              text-base sm:text-lg leading-relaxed px-4 sm:px-0">
        Want to chat? Feel free to{" "}
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"
          className="inline-block min-h-[44px] px-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
        DM me on LinkedIn
        </a>{" "}
        or{" "}
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
            className="inline-block min-h-[44px] px-1 text-red-600 dark:text-blue-400 font-medium hover:underline">
          Twitter
        </a>{" "}
        with a direct question, or{" "}
        <a href="https://calendly.com" target="_blank" rel="noopener noreferrer"
       className="inline-block min-h-[44px] px-1 text-green-600 dark:text-blue-400 font-medium hover:underline">
          book a meeting
        </a>{" "}
        if you prefer a scheduled call. I'll respond whenever I can, but I do ignore all soliciting.
      </p>
    </section>
  );
}

function ClosingSection() {
  return (
    <section className="max-w-5xl mx-auto px-5 sm:px-8 md:px-10 lg:px-12 w-full mt-16 text-center">
      <span className="inline-block px-5 py-2 rounded-full text-lg sm:text-xl 
        bg-black/5 dark:bg-white/10 
        ring-1 ring-black/10 dark:ring-white/15 
        text-neutral-900 dark:text-neutral-100 font-bold">
        ⚡ Built by me ❤️ no tutorials, just pure prompting
      </span>

      <p className="text-neutral-700 dark:text-neutral-400 mt-4 text-lg sm:text-xl max-w-3xl mx-auto">
        Crafted entirely with code & creativity. Always learning, always building.
      </p>
    </section>
  );
}



function HomeView() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <Hero />
      <About />
      <Experience />
      <Education />
      <Skills />
      <ProjectsSection />
      <VenturesSection />
      <ContactSection />
      <ClosingSection />
    </div>
  );
}

function BlogCard({ post }) {
  return (
    <Card as="a" href={`#/blog/${post.slug}`} className="block group">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.date).toLocaleDateString()}</span>
          </div>
          <h3 className="text-neutral-900 dark:text-white text-lg sm:text-xl font-semibold mt-1 group-hover:underline flex items-center gap-1">
            {post.title}
            <ArrowUpRight className="w-4 h-4" />
          </h3>
          <p className="text-neutral-700 dark:text-neutral-300 mt-1 line-clamp-2">{post.excerpt}</p>
          <div className="mt-2 flex gap-2 flex-wrap">
            {post.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-1 text-xs rounded-full bg-black/5 dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10 text-neutral-700 dark:text-neutral-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function BlogView() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return BLOG_POSTS.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.tags.join(" ").toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <div className="max-w-5xl mx-auto w-full px-5 sm:px-8 md:px-10 lg:px-12 pt-12 sm:pt-16">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Blog
          </h1>
          <p className="text-neutral-700 dark:text-neutral-300 mt-2 max-w-2xl">
            Notes on building scalable products, GenAI engineering, and
            founder-oriented tech.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search posts"
            className="w-full sm:w-72 px-4 py-2.5 rounded-xl bg-white/90 dark:bg-neutral-900/80 ring-1 ring-black/10 dark:ring-white/10 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-black/20 dark:focus:ring-white/30"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 mt-6 sm:mt-8">
        {filtered.map((p) => (
          <BlogCard key={p.slug} post={p} />
        ))}
        {filtered.length === 0 && (
          <Card className="text-neutral-400">No posts match your search.</Card>
        )}
      </div>
    </div>
  );
}

/* --------------------------- Shell / Layout ----------------------------- */
function Dock({ view, dark, setDark }) {
  const go = (key) => {
    window.location.hash = key === "blog" ? "/blog" : "/";
  };

  const socials = [
    { label: "GitHub", Icon: Github, href: "https://github.com/" },
    { label: "LinkedIn", Icon: Linkedin, href: "https://www.linkedin.com/" },
    { label: "X", Icon: IconX, href: "https://x.com/" },
  ];

  return (
    <div className="fixed left-1/2 -translate-x-1/2 z-40 bottom-[max(env(safe-area-inset-bottom),0.75rem)]">
      <motion.nav
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md shadow-lg
        border border-white/20 dark:border-white/10 rounded-2xl
        px-1.5 py-1.5 sm:px-6 sm:py-4 flex items-center justify-center gap-1 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Left: Home | Blog */}
          <div className="min-w-[44px] min-h-[44px] flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.12, y: -4 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => go("home")}
              className={cx(
                "relative px-3 py-2 sm:px-5 sm:py-3 rounded-lg",
                view === "home"
                  ? "bg-black/20 dark:bg-white/20 text-black dark:text-white"
                  : "text-neutral-600 dark:text-neutral-200 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
              )}
              aria-label="Home"
              title="Home"
            >
              <Home className="w-5 h-5 sm:w-6 sm:h-6" />
              {view === "home" && (
              <motion.span
                layoutId="dock-dot"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 
                w-1.5 h-1.5 rounded-full bg-current"  />
              )}

            </motion.button>
            <motion.button
              whileHover={{ scale: 1.12, y: -4 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => go("blog")}
              className={cx(
                "relative px-3 py-2 sm:px-5 sm:py-3 rounded-lg",
                view === "blog"
                  ? "bg-black/20 dark:bg-white/20 text-black dark:text-white"
                  : "text-neutral-600 dark:text-neutral-200 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
              )}
              aria-label="Blog"
              title="Blog"
            >
              <Notebook className="w-5 h-5 sm:w-6 sm:h-6" />
              {view === "blog" && (
              <motion.span
              layoutId="dock-dot"
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 
               w-1.5 h-1.5 rounded-full bg-current"  />
              )}
            </motion.button>
          </div>

          {/* Divider */}
          <div className="h-5 w-px sm:h-6 bg-black/20 dark:bg-white/30" />

          {/* Right: links */}
          <div className="min-w-[44px] min-h-[44px] flex items-center justify-center">
            {socials.map(({ Icon, label, href }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                title={label}
                whileHover={{ scale: 1.12, y: -4 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="px-5 py-3 rounded-xl inline-flex items-center justify-center text-neutral-600 dark:text-neutral-200 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                aria-label={label}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.a>
            ))}
          </div>

          {/* Divider */}
          <div className="h-5 w-px sm:h-6 bg-black/20 dark:bg-white/30" />

          {/* Theme toggle */}
          <motion.button
            whileHover={{ scale: 1.12, y: -4 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => setDark((d) => !d)}
            className="px-3 py-2 sm:px-5 sm:py-3 rounded-lg inline-flex items-center justify-center text-neutral-600 dark:text-neutral-200 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="w-5 h-5 sm:w-6 sm:h-6" /> : <Moon className="w-5 h-5 sm:w-6 sm:h-6" />}
          </motion.button>
        </div>
      </motion.nav>
    </div>
  );
}


/* --------------------------------- App ---------------------------------- */
export default function App() {
  const [view, setView] = useState("home");
  const [dark, setDark] = useState(true); // start dark

  // Load Inter font once (no need to edit index.html)
  useEffect(() => {
    const id = "inter-font-link";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  // Apply dark class to <html> (this fixes the darkMode bug)
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  // Hash-based routing for deep links (#/blog)
  useEffect(() => {
    const apply = () => {
      const hash = window.location.hash.replace(/^#\/?/, "");
      if (hash.startsWith("blog")) setView("blog");
      else setView("home");
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  return (
    <div className='min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white selection:bg-black/10 dark:selection:bg-white/20 selection:text-inherit font-["Inter",ui-sans-serif]'>
      <AnimatePresence mode="wait">
        {view === "home" ? (
          <motion.main
            key="home"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="pb-28"
          >
            <HomeView />
          </motion.main>
        ) : (
          <motion.main
            key="blog"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="pb-28"
          >
            <BlogView />
          </motion.main>
        )}
      </AnimatePresence>

      <Dock view={view} dark={dark} setDark={setDark} />

      <footer className="text-center py-6 text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
      
      </footer>

    </div>
  );
}
