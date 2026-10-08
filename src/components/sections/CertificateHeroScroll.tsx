"use client";

import { useEffect, useMemo, useRef, useState, type FC } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, ExternalLink } from "lucide-react";

interface CertificateHeroScrollProps { onDownloadClick?: () => void; isLowPowerMode?: boolean; }
interface CertificateItem { id: string; name: string; image: string; pdf: string; }

const FALLBACK_CERTIFICATES: CertificateItem[] = [
  { id: "fallback-1", name: "AI Infrastructure and Operations Fundamentals", image: "/Certificate/AI Infrastructure and Operations Fundamentals.png", pdf: "/Certificate/AI Infrastructure and Operations Fundamentals.pdf" },
  { id: "fallback-2", name: "AI and Machine Learning Algorithms and Techniques", image: "/Certificate/AI and Machine Learning Algorithms and Techniques.png", pdf: "/Certificate/AI and Machine Learning Algorithms and Techniques.pdf" },
  { id: "fallback-3", name: "Accelerate Your Job Search with AI", image: "/Certificate/Accelerate Your Job Search with AI.png", pdf: "/Certificate/Accelerate Your Job Search with AI.pdf" },
  { id: "fallback-4", name: "Advanced Ethical Hacking & Cybersecurity", image: "/Certificate/Advanced Ethical Hacking & Cybersecurity.png", pdf: "/Certificate/Advanced Ethical Hacking & Cybersecurity.pdf" },
  { id: "fallback-5", name: "Website Design and Development Internship", image: "/Certificate/Arham Topiwala - Website Design and Development Internship - Internship.png", pdf: "/Certificate/Arham Topiwala - Website Design and Development Internship - Internship.pdf" },
  { id: "fallback-6", name: "Building AI Chatbots", image: "/Certificate/Chatbots.png", pdf: "/Certificate/Chatbots.pdf" },
];

const encodePath = (value: string) => {
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/api/")) return value;
  return value.split("/").map((part, i) => i === 0 ? part : encodeURIComponent(part)).join("/");
};

const CertificatePreview = ({ certificate }: { certificate: CertificateItem }) => {
  const isPdf = certificate.pdf.toLowerCase().includes(".pdf") || certificate.pdf.startsWith("/api/certificates");
  if (isPdf) {
    return <iframe src={`${encodePath(certificate.pdf)}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} title={certificate.name} className="absolute inset-0 w-full h-full border-0 bg-white pointer-events-none" loading="lazy" />;
  }
  return <img src={encodePath(certificate.image)} alt={certificate.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />;
};

const CertificateHeroScroll: FC<CertificateHeroScrollProps> = ({ isLowPowerMode = false }) => {
  const spacerRef = useRef<HTMLDivElement>(null); const fixedRef = useRef<HTMLDivElement>(null); const contentRef = useRef<HTMLDivElement>(null); const cardsRef = useRef<HTMLDivElement>(null);
  const [activeCertificate, setActiveCertificate] = useState(0);
  const [certificates, setCertificates] = useState<CertificateItem[]>(FALLBACK_CERTIFICATES);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/certificates')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Certificate sync failed')))
      .then((payload) => {
        if (cancelled || !Array.isArray(payload.certificates) || payload.certificates.length === 0) return;
        setCertificates(payload.certificates.map((certificate: { id: string; title: string; image: string; credentialUrl: string }) => ({
          id: certificate.id,
          name: certificate.title,
          image: certificate.image,
          pdf: certificate.credentialUrl,
        })));
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  const featured = useMemo(() => certificates.slice(0, 6), [certificates]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!spacerRef.current || !fixedRef.current || !contentRef.current || !cardsRef.current) return;
    const cards = Array.from(cardsRef.current.children);
    const ctx = gsap.context(() => {
      gsap.set(cards, { opacity: 0, scale: 0.82, y: 35 });
      gsap.to(cards, { opacity: 1, scale: 1, y: 0, duration: isLowPowerMode ? 0.5 : 0.9, stagger: isLowPowerMode ? 0.04 : 0.08, ease: "power2.out" });
      const timeline = gsap.timeline({ scrollTrigger: { trigger: spacerRef.current, start: "top top", end: "bottom bottom", scrub: isLowPowerMode ? 0.15 : 0.45 } });
      timeline.to(contentRef.current, { autoAlpha: 0, scale: 0.9, duration: 0.18 }, 0);
      timeline.to(cards, { y: (index) => index % 2 === 0 ? -25 : 25, rotate: (index) => index % 2 === 0 ? -2 : 2, duration: 0.8, stagger: 0, ease: "power2.inOut" }, 0);
      timeline.to({}, { duration: 1 });
    }, spacerRef);
    const fadeTrigger = ScrollTrigger.create({ trigger: spacerRef.current, start: "bottom top", onEnter: () => gsap.to(fixedRef.current, { autoAlpha: 0, duration: 0.4 }), onLeaveBack: () => gsap.to(fixedRef.current, { autoAlpha: 1, duration: 0.4 }) });
    return () => { ctx.revert(); fadeTrigger.kill(); };
  }, [isLowPowerMode, featured.length]);

  return <>
    <div ref={spacerRef} className="h-[300vh] w-full relative z-10 pointer-events-none" />
    <div ref={fixedRef} className="fixed inset-0 z-10 h-screen w-full overflow-hidden bg-transparent pointer-events-none">
      <div className="absolute inset-0 opacity-20 pointer-events-none"><div className="absolute top-[15%] right-[8%] w-[520px] h-[520px] bg-primary/10 blur-[100px] rounded-full" /><div className="absolute bottom-[5%] left-[5%] w-[420px] h-[420px] bg-secondary/10 blur-[100px] rounded-full" /></div>
      <div ref={contentRef} className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-50 pt-10 pb-32">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary/50 backdrop-blur-md border border-border/50 text-xs font-medium mb-6">Professional Milestones</div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">Certificates<br />& Awards</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">Explore the certifications, training credentials, and professional milestones.</p>
        <button onClick={() => window.scrollTo({ top: window.innerHeight * 1.1, behavior: "smooth" })} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all group pointer-events-auto"><span>Scroll to Explore</span><ChevronDown className="w-4 h-4 animate-bounce" /></button>
      </div>
      <div ref={cardsRef} className="absolute inset-0 pointer-events-none">
        {featured.map((certificate, index) => <div key={certificate.id} className="absolute pointer-events-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-card/80 backdrop-blur-md group" style={{ top: index < 3 ? "15%" : "61%", left: index % 3 === 0 ? "5%" : index % 3 === 1 ? "39%" : "72%", width: index % 3 === 1 ? "20%" : "22%", height: index % 3 === 1 ? "22%" : "24%" }} onMouseEnter={() => setActiveCertificate(index)}>
          <a href={encodePath(certificate.pdf)} target="_blank" rel="noopener noreferrer" className="block w-full h-full" aria-label={`Open ${certificate.name} certificate`}>
            <CertificatePreview certificate={certificate} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent pointer-events-none" />
            <div className="absolute left-4 right-4 bottom-4"><div className="flex items-end justify-between gap-3"><span className="text-xs md:text-sm font-bold text-white leading-tight drop-shadow-lg line-clamp-2">{certificate.name}</span><ExternalLink className="w-4 h-4 text-white/80 shrink-0" /></div></div>
          </a>
        </div>)}
      </div>
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-[60] hidden md:flex items-center gap-2 pointer-events-auto">{featured.map((certificate, index) => <a key={certificate.id} href={encodePath(certificate.pdf)} target="_blank" rel="noopener noreferrer" title={certificate.name} onMouseEnter={() => setActiveCertificate(index)} className={`h-1.5 rounded-full transition-all duration-300 ${activeCertificate === index ? "w-10 bg-foreground" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"}`} />)}</div>
    </div>
  </>;
};

export default CertificateHeroScroll;
