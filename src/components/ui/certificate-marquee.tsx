"use client";

import { motion, MotionValue, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

interface Certificate { id: string; title: string; image: string; pdf: string; }

const FALLBACK_CERTIFICATES: Certificate[] = [
  { id: "fallback-1", title: "AI Infrastructure and Operations Fundamentals", image: "/Certificate/AI Infrastructure and Operations Fundamentals.png", pdf: "/Certificate/AI Infrastructure and Operations Fundamentals.pdf" },
  { id: "fallback-2", title: "AI and Machine Learning Algorithms and Techniques", image: "/Certificate/AI and Machine Learning Algorithms and Techniques.png", pdf: "/Certificate/AI and Machine Learning Algorithms and Techniques.pdf" },
  { id: "fallback-3", title: "Accelerate Your Job Search with AI", image: "/Certificate/Accelerate Your Job Search with AI.png", pdf: "/Certificate/Accelerate Your Job Search with AI.pdf" },
  { id: "fallback-4", title: "Advanced Ethical Hacking & Cybersecurity", image: "/Certificate/Advanced Ethical Hacking & Cybersecurity.png", pdf: "/Certificate/Advanced Ethical Hacking & Cybersecurity.pdf" },
  { id: "fallback-5", title: "Website Design and Development Internship", image: "/Certificate/Arham Topiwala - Website Design and Development Internship - Internship.png", pdf: "/Certificate/Arham Topiwala - Website Design and Development Internship - Internship.pdf" },
  { id: "fallback-6", title: "Building AI Chatbots", image: "/Certificate/Chatbots.png", pdf: "/Certificate/Chatbots.pdf" },
];

const encodePath = (path: string) => {
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/api/")) return path;
  return path.split("/").map((part, i) => i === 0 ? part : encodeURIComponent(part)).join("/");
};

function ScrambleButton({ href }: { href: string }) {
  const [displayText, setDisplayText] = useState("View All Achievements"); const [isScrambling, setIsScrambling] = useState(false);
  const originalText = "View All Achievements"; const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  const scramble = () => { if (isScrambling) return; setIsScrambling(true); let iteration = 0; const maxIterations = originalText.length; const interval = setInterval(() => { setDisplayText(originalText.split("").map((letter, index) => index < iteration ? originalText[index] : chars[Math.floor(Math.random() * chars.length)]).join("")); if (iteration >= maxIterations) { clearInterval(interval); setIsScrambling(false); } iteration += 1 / 3; }, 30); };
  return <Link href={href} onMouseEnter={scramble} className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-primary/20"><span className="relative z-10">{displayText}</span><ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" /><div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/10 to-primary/0 translate-x-[-100%] group-hover:animate-[move-x_1.5s_infinite]" /></Link>;
}

type ColumnProps = { images: Certificate[]; y: MotionValue<number>; };

const CertificateCard = ({ certificate }: { certificate: Certificate }) => {
  const isPdf = certificate.pdf.toLowerCase().includes(".pdf") || certificate.pdf.startsWith("/api/certificates");
  return <div className="relative w-full overflow-hidden rounded-none bg-zinc-100 dark:bg-zinc-900 ring-1 ring-black/5 dark:ring-white/10 group" style={{ paddingTop: "75%" }}>
    <a href={encodePath(certificate.pdf)} target="_blank" rel="noopener noreferrer" aria-label={`Open ${certificate.title} certificate`} className="absolute inset-0 block">
      {isPdf ? <iframe src={`${encodePath(certificate.pdf)}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} title={certificate.title} className="absolute inset-0 h-full w-full border-0 bg-white pointer-events-none" loading="lazy" /> : <img src={encodePath(certificate.image)} alt={certificate.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" /><div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-2 p-4"><span className="text-sm font-semibold leading-tight text-white drop-shadow-lg">{certificate.title}</span><ExternalLink className="h-4 w-4 shrink-0 text-white/90" /></div>
    </a>
  </div>;
};

const Column = ({ images, y }: ColumnProps) => <motion.div className="relative -top-[45%] flex h-full w-1/3 min-w-[250px] flex-col gap-4 md:gap-6 first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-65%] will-change-transform" style={{ y, translateZ: 0 }}>{images.map((certificate) => <CertificateCard key={certificate.id} certificate={certificate} />)}</motion.div>;

export function CertificateShowcase() {
  const gallery = useRef<HTMLDivElement>(null); const [dimension, setDimension] = useState({ width: 0, height: 0 }); const [certificates, setCertificates] = useState<Certificate[]>(FALLBACK_CERTIFICATES);
  const { scrollYProgress } = useScroll({ target: gallery, offset: ["start end", "end start"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 20, damping: 15, mass: 0.2, restDelta: 0.001 });
  const { height } = dimension; const y = useTransform(smoothProgress, [0, 1], [0, height * 1.2]); const y2 = useTransform(smoothProgress, [0, 1], [0, height * 2.0]); const y3 = useTransform(smoothProgress, [0, 1], [0, height * 0.8]);

  useEffect(() => { const resize = () => setDimension({ width: window.innerWidth, height: window.innerHeight }); window.addEventListener("resize", resize); resize(); return () => window.removeEventListener("resize", resize); }, []);
  useEffect(() => { let cancelled = false; fetch('/api/certificates').then((response) => response.ok ? response.json() : Promise.reject(new Error('Certificate sync failed'))).then((payload) => { if (cancelled || !Array.isArray(payload.certificates) || payload.certificates.length === 0) return; setCertificates(payload.certificates.map((certificate: { id: string; title: string; image: string; credentialUrl: string }) => ({ id: certificate.id, title: certificate.title, image: certificate.image, pdf: certificate.credentialUrl }))); }).catch(() => undefined); return () => { cancelled = true; }; }, []);

  const columns = certificates.length ? certificates : FALLBACK_CERTIFICATES;
  const c1 = columns.filter((_, i) => i % 3 === 0).slice(0, 10); const c2 = columns.filter((_, i) => i % 3 === 1).slice(0, 10); const c3 = columns.filter((_, i) => i % 3 === 2).slice(0, 10);
  const column1 = c1.length ? c1 : columns.slice(0, 6); const column2 = c2.length ? c2 : columns.slice(0, 6); const column3 = c3.length ? c3 : columns.slice(0, 6);

  return <section className="relative w-full bg-background overflow-hidden pb-32"><div className="container mx-auto px-4 md:px-12 lg:px-24 relative z-10 max-w-[1750px] mb-20 pt-20"><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }} className="flex flex-col items-center text-center justify-center gap-8 w-full"><div className="space-y-6 w-full"><div className="space-y-4"><h2 className="text-sm font-bold tracking-[0.2em] text-primary/60 uppercase">Certifications & Achievements</h2><h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight max-w-none text-foreground">Validating <span className="text-shiny">Excellence</span> through Global Standards.</h3><p className="text-lg text-muted-foreground max-w-none leading-relaxed lg:whitespace-nowrap">A collection of my professional certifications in AI, Web Development, and Cloud Engineering from industry leaders.</p></div></div><div className="flex justify-center mt-4"><ScrambleButton href="/achievements" /></div></motion.div></div><div className="w-full max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12"><div ref={gallery} className="relative box-border flex h-[100vh] md:h-[130vh] gap-4 md:gap-6 overflow-hidden rounded-none"><Column images={column1} y={y} /><Column images={column2} y={y2} /><Column images={column3} y={y3} /></div></div><div className="absolute top-[20%] left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" /><div className="absolute bottom-[10%] right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" /></section>;
}
