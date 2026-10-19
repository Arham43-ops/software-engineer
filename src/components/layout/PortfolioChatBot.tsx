'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowUp, Bot, Check, Maximize2, Minimize2, RotateCcw, Sparkles, X } from 'lucide-react';
import { useLocale } from 'next-intl';
import { portfolioData } from '@/data/portfolio';

type Message = { id: string; role: 'user' | 'assistant'; content: string; error?: boolean; timestamp: Date };

const suggestions = [
    'What are Arham’s main skills?',
    'Tell me about his best projects',
    'What is his professional experience?',
    'Which technologies and tools does he use?',
];

function id() { return Math.random().toString(36).slice(2, 10); }
function time(d: Date) { return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }

function Markdown({ text }: { text: string }) {
    return <div className="space-y-2 text-[13.5px] leading-[1.7] whitespace-pre-wrap break-words">
        {text.split('\n').map((line, i) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={i} className="h-1" />;
            if (/^[-*•] /.test(trimmed)) return <div key={i} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D1FF4D]" /><span>{trimmed.slice(2)}</span></div>;
            return <p key={i}>{line}</p>;
        })}
    </div>;
}

function Bubble({ message, retry }: { message: Message; retry?: () => void }) {
    const user = message.role === 'user';
    return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className={`flex gap-3 ${user ? 'justify-end' : 'justify-start'}`}>
        {!user && <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] shadow-[0_4px_18px_rgba(0,0,0,0.25)]"><Bot className="h-4 w-4 text-white/75" /></div>}
        <div className={`flex max-w-[84%] flex-col gap-1 ${user ? 'items-end' : 'items-start'}`}>
            <div className={user
                ? 'rounded-2xl rounded-tr-md border border-white/10 bg-white/[0.10] px-4 py-3 text-white shadow-[0_8px_30px_rgba(0,0,0,0.22)]'
                : message.error
                    ? 'rounded-2xl rounded-tl-md border border-red-400/20 bg-red-400/[0.07] px-4 py-3 text-red-200'
                    : 'rounded-2xl rounded-tl-md border border-white/[0.09] bg-[#171817]/90 px-4 py-3 text-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.16)]'}>
                {user ? <p className="whitespace-pre-wrap text-[13.5px] leading-6">{message.content}</p> : message.error ? <div className="space-y-2"><div className="flex gap-2"><AlertCircle className="mt-1 h-4 w-4 shrink-0" /><p className="text-[13.5px] leading-6">{message.content}</p></div>{retry && <button onClick={retry} className="inline-flex items-center gap-1 text-xs underline underline-offset-2"><RotateCcw className="h-3 w-3" /> Try again</button>}</div> : <Markdown text={message.content} />}
            </div>
            <span className="px-1 text-[10px] text-white/25">{time(message.timestamp)}</span>
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
    const panelRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
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
        setMessages([{ id: id(), role: 'assistant', content: `Hi, I’m Arham AI. I can help you explore ${portfolioData.personal.name}’s skills, projects, experience, education, certifications, and technologies. What would you like to know?`, timestamp: new Date() }]);
    }, []);

    useEffect(() => { if (messages.length) sessionStorage.setItem('portfolio-chat-messages', JSON.stringify(messages)); }, [messages]);

    useEffect(() => {
        const handler = (event: Event) => {
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

    useEffect(() => {
        if (!open) return;
        const frame = window.requestAnimationFrame(() => {
            window.setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 20);
        });
        return () => window.cancelAnimationFrame(frame);
    }, [open, messages.length, loading]);

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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none fixed inset-0 z-[90] bg-black/10" />
            <motion.div
                ref={panelRef}
                initial={{ opacity: 0, scale: 0.94, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 14 }}
                transition={{ type: 'spring', stiffness: 330, damping: 28 }}
                className={`fixed z-[100] ${expanded ? 'inset-4 md:inset-8' : 'bottom-5 right-5 md:bottom-8 md:right-8 w-[min(520px,calc(100vw-2rem))] h-[min(700px,calc(100vh-2rem))]'} flex flex-col overflow-hidden rounded-[26px] border border-white/[0.12] bg-[#101110]/[0.97] shadow-[0_30px_100px_rgba(0,0,0,0.72)] backdrop-blur-2xl`}
            >
                <div className="relative shrink-0 overflow-hidden border-b border-white/[0.08] bg-[#151615]/90 px-5 py-4">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(209,255,77,0.10),transparent_34%),linear-gradient(120deg,rgba(255,255,255,0.035),transparent_45%)]" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_6px_24px_rgba(0,0,0,0.25)]"><Bot className="h-5 w-5 text-white/80" /><span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#151615] bg-[#D1FF4D] shadow-[0_0_10px_rgba(209,255,77,0.55)]" /></div>
                            <div><div className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em] text-white">Arham AI <Sparkles className="h-3.5 w-3.5 text-[#D1FF4D]" /></div><p className="mt-0.5 text-[11px] text-white/40">Portfolio assistant <span className="px-1 text-white/20">•</span> Ask about Arham</p></div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button type="button" onClick={() => setExpanded(v => !v)} className="flex h-9 w-9 items-center justify-center rounded-xl text-white/40 transition hover:bg-white/[0.08] hover:text-white" aria-label={expanded ? 'Minimize' : 'Expand'}>{expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}</button>
                            <button type="button" onClick={close} className="flex h-9 w-9 items-center justify-center rounded-xl text-white/40 transition hover:bg-white/[0.08] hover:text-white" aria-label="Close chat"><X className="h-5 w-5" /></button>
                        </div>
                    </div>
                </div>

                <div className="portfolio-chat-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-5" data-lenis-prevent>
                    <div className="space-y-5">
                        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 shadow-[0_6px_24px_rgba(0,0,0,0.12)]"><div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D1FF4D]/10"><Check className="h-3 w-3 text-[#D1FF4D]" /></span> Portfolio aware</div><p className="mt-2 text-xs leading-5 text-white/35">I use the information available in Arham’s portfolio to keep answers specific and accurate.</p></div>
                        {messages.map((message, index) => <Bubble key={message.id} message={message} retry={message.error && index === messages.length - 1 ? retry : undefined} />)}
                        {loading && <div className="flex items-center gap-3 text-xs text-white/40"><div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]"><Bot className="h-4 w-4 text-white/70" /></div><div className="flex items-center gap-2"><span className="flex gap-1"><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#D1FF4D]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#D1FF4D] [animation-delay:120ms]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#D1FF4D] [animation-delay:240ms]" /></span> Thinking…</div></div>}
                        {messages.length <= 1 && !loading && <div className="grid grid-cols-1 gap-2">{suggestions.map(q => <button key={q} type="button" onClick={() => send(q)} className="group flex items-center rounded-xl border border-white/[0.07] bg-white/[0.018] px-3.5 py-3 text-left text-xs text-white/50 transition hover:border-white/15 hover:bg-white/[0.045] hover:text-white"><span className="mr-2 text-[#D1FF4D]/80 transition group-hover:translate-x-0.5">→</span>{q}</button>)}</div>}
                        <div ref={bottomRef} className="h-px w-full" />
                    </div>
                </div>

                <div className="shrink-0 border-t border-white/[0.08] bg-[#0d0e0d]/95 p-4">
                    <div className="flex items-end gap-2 rounded-2xl border border-white/[0.09] bg-white/[0.035] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition focus-within:border-white/20 focus-within:bg-white/[0.045]">
                        <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }} rows={1} disabled={loading} placeholder="Ask me anything about Arham…" className="min-h-10 max-h-28 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-white/25 disabled:opacity-50" />
                        <button type="button" onClick={() => send(input)} disabled={!input.trim() || loading} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-black transition hover:bg-[#D1FF4D] hover:shadow-[0_0_18px_rgba(209,255,77,0.18)] disabled:cursor-not-allowed disabled:opacity-25" aria-label="Send"><ArrowUp className="h-[18px] w-[18px]" /></button>
                    </div>
                    <p className="mt-2 text-center text-[10px] text-white/20">Enter to send <span className="px-1">•</span> Shift + Enter for a new line</p>
                </div>
                <style jsx>{`
                    .portfolio-chat-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.20) transparent; }
                    .portfolio-chat-scrollbar::-webkit-scrollbar { width: 7px; }
                    .portfolio-chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .portfolio-chat-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.18); border-radius: 999px; border: 2px solid transparent; background-clip: padding-box; }
                    .portfolio-chat-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(209,255,77,0.48); border: 2px solid transparent; background-clip: padding-box; }
                `}</style>
            </motion.div>
        </>}
    </AnimatePresence>;
}
