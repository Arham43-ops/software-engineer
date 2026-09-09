"use client";

import { motion, MotionValue, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import Image from "next/image";

const certificates = [
  {
    title: "AI Infrastructure and Operations Fundamentals",
    image: "/Certificate/AI Infrastructure and Operations Fundamentals.png",
    pdf: "/Certificate/AI Infrastructure and Operations Fundamentals.pdf",
  },
  {
    title: "AI and Machine Learning Algorithms and Techniques",
    image: "/Certificate/AI and Machine Learning Algorithms and Techniques.png",
    pdf: "/Certificate/AI and Machine Learning Algorithms and Techniques.pdf",
  },
  {
    title: "Accelerate Your Job Search with AI",
    image: "/Certificate/Accelerate Your Job Search with AI.png",
    pdf: "/Certificate/Accelerate Your Job Search with AI.pdf",
  },
  {
    title: "Advanced Ethical Hacking & Cybersecurity",
    image: "/Certificate/Advanced Ethical Hacking & Cybersecurity.png",
    pdf: "/Certificate/Advanced Ethical Hacking & Cybersecurity.pdf",
  },
  {
    title: "Website Design and Development Internship",
    image: "/Certificate/Arham Topiwala - Website Design and Development Internship - Internship.png",
    pdf: "/Certificate/Arham Topiwala - Website Design and Development Internship - Internship.pdf",
  },
  {
    title: "Chatbots",
    image: "/Certificate/Chatbots.png",
    pdf: "/Certificate/Chatbots.pdf",
  },
  {
    title: "Create Interactive Dashboards with Streamlit and Python",
    image: "/Certificate/Create Interactive Dashboards with Streamlit and Python.png",
    pdf: "/Certificate/Create Interactive Dashboards with Streamlit and Python.pdf",
  },
  {
    title: "Ethical Hacking Specialization",
    image: "/Certificate/Ethical Hacking Specialization.png",
    pdf: "/Certificate/Ethical Hacking Specialization.pdf",
  },
  {
    title: "Fast Prototyping of GenAI Apps with Streamlit",
    image: "/Certificate/Fast Prototyping of GenAI Apps with Streamlit.png",
    pdf: "/Certificate/Fast Prototyping of GenAI Apps with Streamlit.pdf",
  },
  {
    title: "Game Developers and Esports Organizations",
    image: "/Certificate/Game Developers and Esports Organizations.png",
    pdf: "/Certificate/Game Developers and Esports Organizations.pdf",
  },
  {
    title: "IBM Generative AI for Cybersecurity Professionals",
    image: "/Certificate/IBM Generative AI for Cybersecurity Professionals.png",
    pdf: "/Certificate/IBM Generative AI for Cybersecurity Professionals.pdf",
  },
  {
    title: "Introduction to Networking",
    image: "/Certificate/Introduction to Networking.png",
    pdf: "/Certificate/Introduction to Networking.pdf",
  },
  {
    title: "Oracle Cloud and AI",
    image: "/Certificate/Oracle Cloud and AI.png",
    pdf: "/Certificate/Oracle Cloud and AI.pdf",
  },
  {
    title: "System & Network Security Essentials",
    image: "/Certificate/System & Network Security Essentials.png",
    pdf: "/Certificate/System & Network Security Essentials.pdf",
  },
  {
    title: "JavaScript Intermediate Certificate",
    image: "/Certificate/javascript_intermediate certificate.png",
    pdf: "/Certificate/javascript_intermediate certificate.pdf",
  },
  {
    title: "Software Engineer Certificate",
    image: "/Certificate/software_engineer certificate.png",
    pdf: "/Certificate/software_engineer certificate.pdf",
  },
];

const encodePath = (path: string) => encodeURI(path);

function ScrambleButton({ href }: { href: string }) {
  const [displayText, setDisplayText] = useState("View All Achievements");
  const [isScrambling, setIsScrambling] = useState(false);
  const originalText = "View All Achievements";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const maxIterations = originalText.length;

    const interval = setInterval(() => {
      setDisplayText(
        originalText
          .split("")
          .map((letter, index) => {
            if (index < iteration) return originalText[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setIsScrambling(false);
      }

      iteration += 1 / 3;
    }, 30);
  };

  return (
    <Link
      href={href}
      onMouseEnter={scramble}
      className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-primary/20"
    >
      <span className="relative z-10">{displayText}</span>
      <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/10 to-primary/0 translate-x-[-100%] group-hover:animate-[move-x_1.5s_infinite]" />
    </Link>
  );
}

type ColumnProps = {
  images: typeof certificates;
  y: MotionValue<number>;
};

const CertificateCard = ({ certificate }: { certificate: (typeof certificates)[number] }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-none bg-zinc-100 dark:bg-zinc-900 ring-1 ring-black/5 dark:ring-white/10 group" style={{ paddingTop: "75%" }}>
      <a
        href={encodePath(certificate.pdf)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${certificate.title} certificate`}
        className="absolute inset-0 block"
      >
        <Image
          src={encodePath(certificate.image)}
          alt={certificate.title}
          fill
          sizes="(max-width: 1024px) 50vw, 33vw"
          className="pointer-events-none object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-2 p-4">
          <span className="text-sm font-semibold leading-tight text-white drop-shadow-lg">
            {certificate.title}
          </span>
          <ExternalLink className="h-4 w-4 shrink-0 text-white/90" />
        </div>
      </a>
    </div>
  );
};

const Column = ({ images, y }: ColumnProps) => {
  return (
    <motion.div
      className="relative -top-[45%] flex h-full w-1/3 min-w-[250px] flex-col gap-4 md:gap-6 first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-65%] will-change-transform"
      style={{ y, translateZ: 0 }}
    >
      {images.map((certificate) => (
        <CertificateCard key={certificate.pdf} certificate={certificate} />
      ))}
    </motion.div>
  );
};

export function CertificateShowcase() {
  const gallery = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 20,
    damping: 15,
    mass: 0.2,
    restDelta: 0.001,
  });

  const { height } = dimension;
  const y = useTransform(smoothProgress, [0, 1], [0, height * 1.2]);
  const y2 = useTransform(smoothProgress, [0, 1], [0, height * 2.0]);
  const y3 = useTransform(smoothProgress, [0, 1], [0, height * 0.8]);

  useEffect(() => {
    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    resize();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <section className="relative w-full bg-background overflow-hidden pb-32">
      <div className="container mx-auto px-4 md:px-12 lg:px-24 relative z-10 max-w-[1750px] mb-20 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center text-center justify-center gap-8 w-full"
        >
          <div className="space-y-6 w-full">
            <div className="space-y-4">
              <h2 className="text-sm font-bold tracking-[0.2em] text-primary/60 uppercase">
                Certifications & Achievements
              </h2>
              <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight max-w-none text-foreground">
                Validating <span className="text-shiny">Excellence</span> through Global Standards.
              </h3>
              <p className="text-lg text-muted-foreground max-w-none leading-relaxed lg:whitespace-nowrap">
                A collection of my professional certifications in AI, Web Development, and Cloud Engineering from industry leaders.
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <ScrambleButton href="/achievements" />
          </div>
        </motion.div>
      </div>

      <div className="w-full max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
        <div
          ref={gallery}
          className="relative box-border flex h-[100vh] md:h-[130vh] gap-4 md:gap-6 overflow-hidden rounded-none"
        >
          <Column images={[certificates[0], certificates[1], certificates[2], certificates[3], certificates[4], certificates[5]]} y={y} />
          <Column images={[certificates[5], certificates[6], certificates[7], certificates[8], certificates[9], certificates[0]]} y={y2} />
          <Column images={[certificates[9], certificates[8], certificates[7], certificates[6], certificates[5], certificates[4]]} y={y3} />
        </div>
      </div>

      <div className="absolute top-[20%] left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[10%] right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
    </section>
  );
}
