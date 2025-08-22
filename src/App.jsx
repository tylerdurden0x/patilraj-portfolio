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
    className="max-w-5xl mx-auto w-full px-5 sm:px-8 md:px-10 lg:px-12 mt-8 sm:mt-10"
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
  { company: "Cognizant Inc.", role: "Programmer Analyst", start: "July 2022", end: "Present", logo: "/ctslogo.png", details:  [
      "Led data management and querying initiatives for retail sector projects within Cognizant Digital Business (CDB) AI and Analytics domain",
      "Developed and implemented complex SQL queries to solve critical business problems, optimizing data retrieval and analysis processes",
      "Leveraged advanced technologies including RDBMS, SQL, DBT, Python, ETL processes, and Microsoft BI tools to deliver comprehensive data solutions",
      "Built interactive dashboards and reports using Power BI, transforming raw data into actionable insights for stakeholders across retail operations"
    ] },
  { company: "Cognizant Inc.", role: "Microsoft BI Intern", start: "Jan 2022", end: "July 2022", logo: "/ctslogo.png", details: [
    "Completed paid internship during final semester, receiving comprehensive training in Microsoft BI technologies including MySQL, SSMS, SSIS, SSAS, and SSRS.",
    "Developed data visualization dashboards using Power BI and implemented data ingestion pipelines with Azure Data Factory during internship.",
    "Gained practical experience with ETL processes, database management, and business intelligence reporting solutions."
  ] },
  { company: "The Sparks Foundation", role: "DS & Business Analyst", start: "Aug 2021", end: "Oct 2021", logo: "/sparkj.png", details: "Worked on data analysis, predictive modeling, and visualization tasks as part of real-world projects during my Data Science & Business Analyst internship at The Sparks Foundation." },
  { company: "Chegg Inc.", role: "Managed Network Expert", start: "Oct 2020", end: "Dec 2020", logo: "/cheggj.png", details: [
    "Experts answer questions asked by students, following quality parameters defined by Chegg while ensuring academic integrity.",
    "Promoted Chegg expert program among peers and assisted them with expert-related queries through online web meetings."
  ] },
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


/* ---------------- Hero Section ---------------- */


function Hero() {
  return (
    <section className="max-w-5xl mx-auto px-5 sm:px-8 md:px-10 lg:px-12 w-full pt-10 sm:pt-14">
      <div className="grid grid-cols-2 gap-6 sm:gap-10 items-center">
        
        {/* Left: Intro */}
        <div className="text-left max-w-xl space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
  Hi, I'm
  <br />
  <span className="block text-4xl sm:text-6xl lg:text-7xl font-extrabold">
    Raj Patil
  </span>
</h1>
          <p className="text-neutral-900 dark:text-neutral-200 text-lg sm:text-xl lg:text-lg leading-relaxed">
            Quietly building autonomous systems that don't need daily standups | Agents x Ops | Some tools I’m working on aren’t public yet…
          </p>
        </div>

        {/* Right: PNG */}
        <div className="flex justify-end">
          <img
            src="/raj3d.png"
            alt="Raj Patil"
            className="w-28 sm:w-44 md:w-56 lg:w-72 xl:w-80 rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}




/* ---------------- About Section ---------------- */
function About() {
  return (
    <Section id="about" title="About">
      <p className="max-w-[65ch] text-base sm:text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
  I'm an{" "}
  <span className="font-semibold text-neutral-900 dark:text-white">
    Aspiring Machine Learning Engineer
  </span>{" "}
  with experience in{" "}
  <span className="font-semibold text-neutral-900 dark:text-white">
    SQL, Python, and analytics
  </span>{" "}
  at{" "}
  <span className="font-semibold text-neutral-900 dark:text-white">
    Cognizant
  </span>
  . Holder of{" "}
  <span className="font-semibold text-neutral-900 dark:text-white">
    IBM and Microsoft certifications
  </span>
  . Passionate about{" "}
  <span className="font-semibold text-neutral-900 dark:text-white">
    machine learning, business intelligence, and data-driven solutions
  </span>
  .
</p>

    </Section>
  );
}





function ExperienceItem({ e, isOpen, onToggle }) {
  const isImage = typeof e.logo === "string" && e.logo.endsWith(".png");

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
      {/* Row (Logo + Info + Dates) */}
      <div className="flex items-center gap-3 sm:gap-4 w-full overflow-hidden">
        {/* Render image if PNG, else fallback to emoji */}
        <div className="shrink-0 select-none" aria-hidden>
          {isImage ? (
            <img
              src={e.logo}
              alt={e.company}
              className="h-10 w-10 object-contain rounded flex-shrink-0 sm:h-10 sm:w-10 h-8 w-8"
            />
          ) : (
            <span className="text-2xl sm:text-3xl">{e.logo}</span>
          )}
        </div>

        {/* Company + Role */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-neutral-900 dark:text-white truncate">
            {e.company}
          </div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
            {e.role}
          </div>
        </div>

        {/* Dates + Chevron */}
        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap shrink-0">
          <span>
            {e.start} - {e.end}
          </span>
          <ChevronDown
            className={cx(
              "w-4 h-4 transition-transform duration-500",
              isOpen ? "rotate-180" : "rotate-0"
            )}
          />
        </div>
      </div>

      {/* Collapsible details */}
      <div
        className={cx(
          "grid transition-all duration-500 ease-out",
          isOpen
            ? "grid-rows-[1fr] opacity-100 mt-3"
            : "grid-rows-[0fr] opacity-0 mt-0"
        )}
      >
        <div className="overflow-hidden text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {Array.isArray(e.details) ? (
            <ul className="list-disc list-inside space-y-1">
              {e.details.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          ) : (
            e.details
          )}
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
    name: "Dr. DY Patil Institute of Technology, Pimpri, Pune",
    sub: "B.E, Mechanical Engineering (CGPA: 8.65)",
    period: "2018 - 2022",
    logo: "🎓",
    link: "https://engg.dypvp.edu.in/",   // 👈 add link here
  },
  {
    name: "DevFest",
    sub: "Member (Community of over 16k+)",
    period: "July 2020 - March 2022",
    logo: "🧑‍💻",
    link: "https://engg.dypvp.edu.in/",   // 👈 add link here
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
    <Card className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 cursor-pointer transition hover:scale-[1.02] hover:shadow-lg">
      <div className="text-3xl shrink-0 select-none" aria-hidden>
        {s.logo}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-neutral-900 dark:text-white">
          {s.name}
        </div>
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          {s.sub}
        </div>
      </div>
        <div className="text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap shrink-0">
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
    "Python",
    "SQL",
    "Machine Learning",
    "AWS",
    "GenAI",
    "LangChain",
    "RAG",
    "Prompting",
    "Docker",
    "PostgreSQL",
    "MSBI",
    "CI/CD (GitHub Actions)"
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
        With a strong foundation in analytics, machine learning, and problem-solving, I’m driven by curiosity and the 
        excitement of turning ideas into impactful solutions. My journey so far has taught me to learn fast, adapt 
        quickly, and keep pushing boundaries and I’m just getting started.
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
      <p className="text-neutral-700 dark:text-neutral-400 mt-6 max-w-2xl mx-auto 
              text-lg sm:text-xl leading-relaxed space-y-3">
        <span>
          Want to chat? Feel free to{" "}
          <a
            href="https://www.linkedin.com/in/thisisrajpatil"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            DM me on LinkedIn
          </a>
          .
        </span>
        <br />
        <span>
          You can also message me on{" "}
          <a
            href="https://x.com/praajhere"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 dark:text-red-400 font-medium hover:underline"
          >
            Twitter
          </a>
          .
        </span>
        <br />
        <span>
          Or{" "}
          <a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 dark:text-green-400 font-medium hover:underline"
          >
            book a meeting
          </a>{" "}
          if you prefer a scheduled call.
        </span>
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
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Helper: pick an image (Substack enclosure -> Unsplash fallback)
  const imageFor = (post) => {
    if (post?.enclosure?.link) return post.enclosure.link;
    const q = encodeURIComponent(
      (post?.title || "creative design tech blog").toLowerCase()
    );
    return `https://source.unsplash.com/random/800x500/?${q}`;
  };

  useEffect(() => {
    fetch(
      "https://api.rss2json.com/v1/api.json?rss_url=https://thisisrajpatil.substack.com/feed"
    )
      .then((r) => r.json())
      .then((data) => {
        setPosts(Array.isArray(data.items) ? data.items : []);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Feed error:", e);
        setLoading(false);
      });
  }, []);

  const filtered = posts.filter((p) =>
    (p.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="relative bg-transparent w-full">
      {/* Top: pill + big heading + subtitle */}
      <div className="max-w-5xl mx-auto px-4 pt-10 sm:pt-14 text-center">
        <div className="max-w-5xl mx-auto px-4 pt-10 sm:pt-14 text-center">
  <span
    className="
      inline-block px-8 py-3 rounded-xl text-2xl font-medium
      bg-neutral-900 text-white
      dark:bg-white dark:text-neutral-900
      ring-1 ring-black/10 dark:ring-white/15
    "
  >
    My Posts
  </span>
</div>


        <h1
          className="mt-5 text-4xl sm:text-6xl font-extrabold tracking-tight
                     text-neutral-900 dark:text-white"
        >
          Blogs and Research Papers
        </h1>

        <p className="mt-4 text-lg sm:text-xl text-neutral-700 dark:text-neutral-300">
          Thoughts, experiments, and notes I’ve published
        </p>

        {/* Glassy search bar */}
        <div className="mt-7 flex justify-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className=" w-full max-w-xl mx-auto mt-6 px-4 py-3
                    rounded-2xl
                    bg-transparent
                    border border-neutral-500 dark:border-neutral-600   /* stronger border */
                    text-neutral-900 dark:text-white
                    placeholder-neutral-500 dark:placeholder-neutral-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    shadow-sm dark:shadow-md  /* subtle depth */"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 mt-10 pb-16">
        {/* Loading / Empty */}
        {loading && (
          <div className="grid sm:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-black/5 dark:bg-white/5
                           ring-1 ring-black/10 dark:ring-white/10 animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center text-neutral-500 dark:text-neutral-400">
            No posts found.
          </div>
        )}

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((post, idx) => (
            <a
              key={idx}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-2xl
                         ring-1 ring-black/10 dark:ring-white/10
                         bg-white/70 dark:bg-neutral-900/70
                         backdrop-blur-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={imageFor(post)}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t
                                from-black/40 via-black/10 to-transparent" />
              </div>

              <div className="p-5">
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {post.title}
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  {post.pubDate ? new Date(post.pubDate).toDateString() : ""}
                </p>

                <p className="mt-3 text-sm text-neutral-700 dark:text-neutral-300 line-clamp-3">
                  {(post.description || "")
                    .replace(/<[^>]+>/g, "")
                    .trim()}
                </p>

                <div className="inline-flex items-center gap-2 px-6 py-2 mt-4 rounded-xl font-medium
                  bg-neutral-900 text-white
                  dark:bg-white dark:text-neutral-900
                  ring-1 ring-black/10 dark:ring-white/15
                  transition hover:scale-105 hover:shadow-md">
                  <Globe className="w-4 h-4" />
                  Read Post
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}








/* --------------------------- Shell / Layout ----------------------------- */
function Dock({ view, dark, setDark }) {
  const go = (key) => {
    window.location.hash = key === "blog" ? "/blog" : "/";
  };

  const socials = [
    { label: "GitHub", Icon: Github, href: "https://github.com/tylerdurden0x" },
    { label: "LinkedIn", Icon: Linkedin, href: "https://www.linkedin.com/in/thisisrajpatil" },
    { label: "X", Icon: IconX, href: "https://x.com/praajhere" },
  ];

  return (
    <div className="fixed inset-x-0 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-40 flex justify-center px-2">
      <motion.nav
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="bg-white/90 dark:bg-neutral-900/80 backdrop-blur-md shadow-lg
           border border-white/20 dark:border-white/10 rounded-2xl
           w-auto max-w-[95vw] sm:max-w-fit overflow-hidden
           flex items-center justify-between gap-2 px-3 py-2">
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
          <div className="flex items-center">
  {socials.map(({ Icon, label, href }) => (
    <div key={label} className="min-w-[44px] min-h-[44px] flex items-center justify-center">
      <motion.a
        href={href}
        target="_blank"
        rel="noreferrer"
        title={label}
        whileHover={{ scale: 1.12, y: -4 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="px-3 py-2 sm:px-5 sm:py-3 rounded-xl inline-flex items-center justify-center
                   text-neutral-600 dark:text-neutral-200 hover:text-black dark:hover:text-white
                   hover:bg-black/5 dark:hover:bg-white/10"
        aria-label={label}
      >
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </motion.a>
    </div>
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
