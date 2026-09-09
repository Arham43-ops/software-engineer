'use client';

import { useState, useMemo, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { gsap } from 'gsap';
import { useLenis } from 'lenis/react';
import { useTranslations } from 'next-intl';
import { Search, X, Layers, ArrowRight, ArrowUpRight, Sparkles, Code2, Zap, Brain, Cpu, Wifi, Blocks, Globe, Database, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { portfolioData } from '@/data/portfolio';
import { Project } from '@/types';
import { HeroParallax } from '@/components/ui/hero-parallax';
import { LogoTimeline, LogoItem } from '@/components/ui/logo-timeline';
import { Icons } from '@/components/icons';
import { Meteors } from '@/components/ui/meteors';
import { ProjectContact } from '@/components/sections/ProjectContact';
import { ProjectStats } from '@/components/sections/ProjectStats';
import { usePerformance } from '@/hooks/usePerformance';
import { ProjectPlaceholder, getPlaceholderImageUrl } from '@/components/projects/ProjectPlaceholder';
import { DeferredMount } from '@/components/ui/DeferredMount';
import { getProjectImages } from '@/app/actions/getProjectImages';

type FilterType = 'all' | 'ongoing' | 'completed';

const ProjectListItem = ({ project, onClick, index, isLowPowerMode }: { project: Project; onClick: () => void; index: number; isLowPowerMode?: boolean }) => {
    const itemRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);
    const isOngoing = project.status === 'ongoing';
    const displayIndex = String(index + 1).padStart(2, '0');
    const techText = project.techStack.join(' • ');
    const bgGradient = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.03), transparent 40%)`;
    const handleMouseMove = (e: React.MouseEvent) => { if (!itemRef.current) return; const rect = itemRef.current.getBoundingClientRect(); mouseX.set(e.clientX - rect.left); mouseY.set(e.clientY - rect.top); cursorX.set(e.clientX); cursorY.set(e.clientY); };
    const handleMouseEnter = (e: React.MouseEvent) => { setIsHovered(true); handleMouseMove(e); };
    return (
        <motion.div ref={itemRef} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }} className="group relative" data-project-slug={project.slug} onMouseEnter={handleMouseEnter} onMouseLeave={() => setIsHovered(false)} onMouseMove={handleMouseMove} onClick={onClick}>
            <motion.div className={cn('relative cursor-pointer overflow-hidden rounded-xl border-b border-white/5 transition-all duration-300', isHovered ? 'bg-white/[0.02]' : 'hover:bg-white/[0.01]')} whileHover={{ scale: 1.002 }}>
                {!isLowPowerMode && <motion.div className="pointer-events-none absolute inset-0 z-0" style={{ opacity: isHovered ? 1 : 0, background: bgGradient }} />}
                <div className="relative z-10 flex items-center gap-4 sm:gap-8 py-6 sm:py-10 px-4 sm:px-8">
                    <motion.span className={cn('text-2xl sm:text-4xl md:text-5xl font-black tabular-nums transition-colors duration-500', isHovered ? (isOngoing ? 'text-emerald-500 dark:text-emerald-400' : 'text-blue-500 dark:text-blue-400') : 'text-muted-foreground/20')} animate={{ scale: isHovered ? 1.1 : 1, x: isHovered ? 5 : 0 }}>{displayIndex}</motion.span>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 sm:gap-4 mb-2"><motion.h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground truncate" animate={{ x: isHovered ? 8 : 0 }}>{project.title}</motion.h3><span className={cn('shrink-0 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider', isOngoing ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 dark:border-emerald-500/20' : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 dark:border-blue-500/20')}>{isOngoing ? 'ongoing' : 'done'}</span></div>
                        <p className="text-muted-foreground text-sm sm:text-base truncate max-w-2xl hidden sm:block">{project.description}</p><p className="text-muted-foreground text-xs line-clamp-1 sm:hidden">{project.description}</p>
                    </div>
                    <motion.div className="shrink-0 hidden sm:flex items-center gap-2" animate={{ x: isHovered ? -5 : 0, opacity: isHovered ? 1 : 0.4 }}><span className="text-sm font-medium text-muted-foreground">view</span><motion.div animate={{ x: isHovered ? 5 : 0 }}><ArrowRight className={cn('w-5 h-5', isHovered ? (isOngoing ? 'text-emerald-500 dark:text-emerald-400' : 'text-blue-500 dark:text-blue-400') : 'text-muted-foreground')} /></motion.div></motion.div>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground sm:hidden" />
                </div>
                {!isLowPowerMode && <AnimatePresence>{isHovered && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]"><div className="relative py-3 overflow-hidden"><motion.div className="flex whitespace-nowrap" animate={{ x: [0, -500] }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}>{[...Array(3)].map((_, i) => <span key={i} className="mx-4 text-sm font-mono tracking-wider text-blue-600/60 dark:text-blue-400/60">{techText} •</span>)}</motion.div></div></motion.div>}</AnimatePresence>}
            </motion.div>
            {!isLowPowerMode && <AnimatePresence>{isHovered && <motion.a href={project.repoUrl} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onClick={(e) => e.stopPropagation()} className="fixed pointer-events-auto z-50 hidden lg:flex items-end justify-between w-[500px] h-[300px] rounded-none overflow-hidden bg-zinc-950 shadow-2xl border border-white/10 p-5" style={{ left: cursorX, top: cursorY, x: '-50%', y: '-50%' }}><div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" /><div className="relative z-10 flex w-full items-end justify-between gap-4"><div><div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/60 mb-2">GitHub Project</div><div className="text-lg font-bold text-white">Open Repository</div></div><ArrowUpRight className="w-6 h-6 text-white" /></div></motion.a>}</AnimatePresence>}
        </motion.div>
    );
};

function ProjectCard({ project, onClick, index, isLowPowerMode }: { project: Project; onClick: () => void; index: number; isLowPowerMode?: boolean; }) {
    const isOngoing = project.status === 'ongoing';
    return (
        <motion.article initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ duration: 0.6, delay: 0.1 * (index % 2) }} className="group cursor-pointer" onClick={onClick}>
            <div className="flex flex-col gap-6 h-full">
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden bg-secondary/10 border border-foreground/5 dark:border-white/10 shadow-sm group-hover:shadow-2xl">
                    {project.image ? <img src={project.image} alt={project.title} loading="lazy" className="w-full h-full object-cover" draggable={false} /> : <ProjectPlaceholder className="absolute inset-0" title={project.title} />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 z-10"><div className="flex items-center gap-3 mb-3"><span className="text-xs font-mono uppercase tracking-widest text-white/60">{project.category || 'Project'}</span></div><h3 className="text-2xl sm:text-3xl font-bold text-white">{project.title}</h3><p className="mt-2 text-sm sm:text-base text-white/70 line-clamp-2">{project.description}</p></div>
                </div>
                <div className="flex flex-wrap gap-2">{project.techStack.slice(0,4).map((tech, i) => <span key={tech} className="px-3 py-1.5 rounded-full border border-foreground/10 text-xs font-medium">{tech}</span>)}{project.techStack.length > 4 && <span className="text-xs text-muted-foreground">+{project.techStack.length - 4}</span>}</div>
            </div>
        </motion.article>
    );
}

function CompactCard({ project, onClick, index }: { project: Project; onClick: () => void; index: number }) {
    return <motion.article initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.06 }} className="group cursor-pointer" onClick={onClick}><motion.div className="relative p-5 rounded-xl bg-zinc-900/50 border border-white/5 h-full backdrop-blur-sm overflow-hidden" whileHover={{ y: -4, scale: 1.02 }}><div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{project.category}</div><h3 className="text-lg font-bold mb-2">{project.title}</h3><p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p></motion.div></motion.article>;
}

function getIconKey(tech: string) { const map: Record<string,string> = { JavaScript:'javascript', TypeScript:'typescript', Python:'python', Kotlin:'kotlin', Java:'java', Android:'android', Django:'django', MySQL:'mysql', React:'react', 'React.js':'react', Node.js:'nodedotjs', Flask:'flask', HTML5:'html5', CSS3:'css3', Bootstrap:'bootstrap' }; return map[tech] || 'code'; }

export default function ProjectsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('projects');
    const { isLowPowerMode } = usePerformance();
    const [filter, setFilter] = useState<FilterType>('all');
    const [view, setView] = useState<'featured' | 'list' | 'compact'>('featured');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const projects = portfolioData.projects;
    const filteredProjects = useMemo(() => filter === 'all' ? projects : projects.filter(p => filter === 'ongoing' ? p.status === 'ongoing' : p.status === 'completed'), [filter, projects]);
    const openProject = (project: Project) => setSelectedProject(project);
    const closeProject = () => setSelectedProject(null);

    return (
        <main className="min-h-screen bg-background text-foreground pt-24 pb-24">
            <section className="container max-w-7xl mx-auto px-6 pt-12 pb-16 text-center">
                <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-4">Project Archive</p>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight">Selected <span className="text-primary">Projects</span></h1>
                <p className="max-w-2xl mx-auto mt-6 text-lg text-muted-foreground">A curated collection of my software engineering, AI, cybersecurity, FinTech, Android, and web development work.</p>
            </section>

            <section className="container max-w-7xl mx-auto px-6">
                <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
                    {(['all','completed','ongoing'] as FilterType[]).map(f => <button key={f} onClick={() => setFilter(f)} className={cn('px-5 py-2 rounded-full border text-sm font-semibold transition-all', filter === f ? 'bg-foreground text-background' : 'border-border/50 hover:border-foreground/30')}>{f === 'all' ? 'All Projects' : f === 'completed' ? 'Completed' : 'Ongoing'}</button>)}
                    <div className="w-px h-7 bg-border/50 mx-2 hidden sm:block" />
                    <button onClick={() => setView('featured')} className={cn('p-2.5 rounded-full border', view === 'featured' ? 'bg-foreground text-background' : 'border-border/50')}><LayoutGrid className="w-4 h-4" /></button>
                    <button onClick={() => setView('list')} className={cn('p-2.5 rounded-full border', view === 'list' ? 'bg-foreground text-background' : 'border-border/50')}><List className="w-4 h-4" /></button>
                    <button onClick={() => setView('compact')} className={cn('p-2.5 rounded-full border', view === 'compact' ? 'bg-foreground text-background' : 'border-border/50')}><Layers className="w-4 h-4" /></button>
                </div>

                {view === 'list' ? (
                    <div className="space-y-2">{filteredProjects.map((project, index) => <ProjectListItem key={project.id} project={project} index={index} isLowPowerMode={isLowPowerMode} onClick={() => window.open(project.repoUrl, '_blank', 'noopener,noreferrer')} />)}</div>
                ) : view === 'compact' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filteredProjects.map((project,index) => <CompactCard key={project.id} project={project} index={index} onClick={() => window.open(project.repoUrl, '_blank', 'noopener,noreferrer')} />)}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">{filteredProjects.map((project,index) => <ProjectCard key={project.id} project={project} index={index} isLowPowerMode={isLowPowerMode} onClick={() => window.open(project.repoUrl, '_blank', 'noopener,noreferrer')} />)}</div>
                )}
            </section>
        </main>
    );
}
