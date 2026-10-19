'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowUp, Bot, Check, Maximize2, Minimize2, RotateCcw, Sparkles, X } from 'lucide-react';
import { useLocale } from 'next-intl';
import { portfolioData } from '@/data/portfolio';

type Message = { id: string; role: 'user' | 'assistant'; content: string; error?: boolean; timestamp: Date };

const suggestions = [
    'What are Arham’s main skills?',
    'Tell me about his projects',
    'What is his current experience?',
    'What technologies does he use?',
];

function id() { return Math.random().toString(36).slice(2, 10); }
function time(d: Date) { return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }

function Markdown({ text }: { text: string }) {
    return <div className="space-y-2 text-[14px] leading-6 whitespace-pre-wrap break-words">{text.split('\n').map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;
        if (/^[-*•] /.test(trimmed)) return <div key={i} className="flex gap-2"><span className="text-[#D1FF4D]">•</span><span>{trimmed.slice(2)}</span></div>;
        return <p key={i}>{line}</p>;
    })}</div>;
}

function Bubble({ message, retry }: { message: Message; retry?: () => void }) {
    const user = message.role === 'user';
    return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${user ? 'justify-end' : 'justify-start'}`}>
        {!user && <div className="mt-1 h-8 w-8 shrink-0 rounded-xl border border-[#D1FF4D]/20 bg-[#D1FF4D]/10 flex items-center justify-center"><Bot className="h-4 w-4 text-[#D1FF4D]" /></div>}
        <div className={`max-w-[82%] ${user ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
            <div className={user ? 'rounded-2xl rounded-tr-md bg-[#D1FF4D] px-4 py-3 text-black shadow-[0_8px_30px_rgba(209,255,77,0.12)]' : message.error ? 'rounded-2xl rounded-tl-md border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-300' : 'rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.06] px-4 py-3 text-white/90'}>
                {user ? <p className="text-[14px] leading-6 whitespace-pre-wrap">{message.content}</p> : message.error ? <div className="space-y-2"><div className="flex gap-2"><AlertCircle className="mt-1 h-4 w-4 shrink-0" /><p className="text-[14px] leading-6">{message.content}</p></div>{retry && <button onClick={retry} className="inline-flex items-center gap-1 text-xs underline underline-offset-2"><RotateCcw className="h-3 w-3" /> Try again</button>}</div> : <Markdown text={message.content} />}
            </div>
            <span className="px-1 text-[10px] text-white/30">{time(message.timestamp)}</span>
        </div>
    </motion.div>;
}

export function PortfolioChatBot() {
    const locale = useLocale();
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [lastUser, setLastUser] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        try {
            const saved = sessionStorage.getItem('portfolio-chat-messages');
            if (saved) {
                const parsed = JSON.parse(saved).map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) }));
                if (Array.isArray(parsed) && parsed.length) { setMessages(parsed); return; }
            }
        } catch {}
        setMessages([{ id: id(), role: 'assistant', content: `Hi, I’m Arham AI. I can answer questions about ${portfolioData.personal.name} — his skills, projects, experience, education, and more.`, timestamp: new Date() }]);
    }, []);

    useEffect(() => { if (messages.length) sessionStorage.setItem('portfolio-chat-messages', JSON.stringify(messages)); }, [messages]);

    useEffect(() => {
        const handler = (event: Event) => {
            const e = event as CustomEvent<{ x?: number; y?: number }>;
            setOrigin(typeof e.detail?.x === 'number' && typeof e.detail?.y === 'number' ? e.detail as { x: number; y: number } : null);
            setOpen(true);
            setExpanded(false);
            window.setTimeout(() => inputRef.current?.focus(), 150);
        };
        window.addEventListener('portfolio:toggle-chatbot', handler);
        return () => window.removeEventListener('portfolio:toggle-chatbot', handler);
    }, []);

    useEffect(() => {
        if (!open) return;
        const outside = (event: PointerEvent) => { if (panelRef.current && !panelRef.current.contains(event.target as Node)) setOpen(false); };
        document.addEventListener('pointerdown', outside);
        return () => document.removeEventListener('pointerdown', outside);
    }, [open]);

    useEffect(() => () => abortRef.current?.abort(), []);

    const close = useCallback(() => { abortRef.current?.abort(); setLoading(false); setOpen(false); }, []);

    const send = useCallback(async (raw: string) => {
        const text = raw.trim();
        if (!text || loading) return;
        setInput(''); setLastUser(text);
        const user: Message = { id: id(), role: 'user', content: text, timestamp: new Date() };
        const history = [...messages.filter(m => !m.error), user].slice(-20).map(({ role, content }) => ({ role, content }));
        setMessages(prev => [...prev, user]); setLoading(true);
        abortRef.current?.abort(); abortRef.current = new AbortController();
        try {
            const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history, locale }), signal: abortRef.current.signal });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data?.error || 'The AI assistant is temporarily unavailable. Please try again.');
            if (!data?.reply) throw new Error('The AI assistant returned an empty response.');
            setMessages(prev => [...prev, { id: id(), role: 'assistant', content: data.reply, timestamp: new Date() }]);
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') return;
            setMessages(prev => [...prev, { id: id(), role: 'assistant', content: error instanceof Error ? error.message : 'Unable to process the request right now.', error: true, timestamp: new Date() }]);
        } finally { setLoading(false); }
    }, [locale, loading, messages]);

    const retry = useCallback(() => { if (!lastUser) return; setMessages(prev => prev[prev.length - 1]?.error ? prev.slice(0, -1) : prev); send(lastUser); }, [lastUser, send]);

    return <AnimatePresence>
        {open && <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] bg-black/20 pointer-events-none" />
            <motion.div
                ref={panelRef}
                initial={{ opacity: 0, scale: 0.82, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.82, y: 18 }}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                className={`fixed z-[100] ${expanded ? 'inset-4 md:inset-8' : 'bottom-5 right-5 md:bottom-8 md:right-8 w-[min(520px,calc(100vw-2rem))] h-[min(700px,calc(100vh-2rem))]'} overflow-hidden rounded-[24px] border border-white/10 bg-[#090909]/95 shadow-[0_30px_100px_rgba(0,0,0,0.65)] backdrop-blur-2xl flex flex-col`}
            >
                <div className="relative shrink-0 border-b border-white/10 px-5 py-4 bg-gradient-to-r from-[#D1FF4D]/10 via-transparent to-transparent">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D1FF4D]/60 to-transparent" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-2xl border border-[#D1FF4D]/25 bg-[#D1FF4D]/10 flex items-center justify-center"><Bot className="h-5 w-5 text-[#D1FF4D]" /><span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-[#090909] bg-[#D1FF4D]" /></div>
                            <div><div className="flex items-center gap-2 text-[15px] font-semibold text-white">Arham AI <Sparkles className="h-3.5 w-3.5 text-[#D1FF4D]" /></div><p className="text-[11px] text-white/45">Portfolio assistant • Ask about Arham</p></div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button type="button" onClick={() => setExpanded(v => !v)} className="h-9 w-9 rounded-xl text-white/45 hover:bg-white/10 hover:text-white transition" aria-label={expanded ? 'Minimize' : 'Expand'}>{expanded ? <Minimize2 className="mx-auto h-4 w-4" /> : <Maximize2 className="mx-auto h-4 w-4" />}</button>
                            <button type="button" onClick={close} className="h-9 w-9 rounded-xl text-white/45 hover:bg-white/10 hover:text-white transition" aria-label="Close chat"><X className="mx-auto h-5 w-5" /></button>
                        </div>
                    </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 space-y-5 [scrollbar-width:thin]" data-lenis-prevent>
                    <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4"><div className="flex items-center gap-2 text-xs font-medium text-[#D1FF4D]"><Check className="h-3.5 w-3.5" /> Portfolio-aware assistant</div><p className="mt-2 text-xs leading-5 text-white/45">Answers are based on Arham’s portfolio data, experience, projects and skills.</p></div>
                    {messages.map((message, index) => <Bubble key={message.id} message={message} retry={message.error && index === messages.length - 1 ? retry : undefined} />)}
                    {loading && <div className="flex items-center gap-3 text-xs text-white/45"><div className="h-8 w-8 rounded-xl border border-[#D1FF4D]/20 bg-[#D1FF4D]/10 flex items-center justify-center"><Bot className="h-4 w-4 text-[#D1FF4D]" /></div><div className="flex gap-1"><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#D1FF4D]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#D1FF4D] [animation-delay:120ms]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#D1FF4D] [animation-delay:240ms]" /></div> Thinking…</div>}
                    {messages.length <= 1 && !loading && <div className="grid grid-cols-1 gap-2">{suggestions.map(q => <button key={q} type="button" onClick={() => send(q)} className="group rounded-xl border border-white/8 bg-white/[0.025] px-3.5 py-3 text-left text-xs text-white/55 transition hover:border-[#D1FF4D]/30 hover:bg-[#D1FF4D]/5 hover:text-white"><span className="mr-2 text-[#D1FF4D]">→</span>{q}</button>)}</div>}
                </div>

                <div className="shrink-0 border-t border-white/10 bg-black/20 p-4">
                    <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2 focus-within:border-[#D1FF4D]/40 transition">
                        <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }} rows={1} disabled={loading} placeholder="Ask me anything about Arham…" className="min-h-10 max-h-28 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-white/25 disabled:opacity-50" />
                        <button type="button" onClick={() => send(input)} disabled={!input.trim() || loading} className="h-10 w-10 shrink-0 rounded-xl bg-[#D1FF4D] text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-30" aria-label="Send"><ArrowUp className="mx-auto h-4.5 w-4.5" /></button>
                    </div>
                    <p className="mt-2 text-center text-[10px] text-white/20">Enter to send • Shift + Enter for a new line</p>
                </div>
            </motion.div>
        </>}
    </AnimatePresence>;
}
