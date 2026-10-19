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

function createId() { return Math.random().toString(36).slice(2, 10); }
function formatTime(date: Date) { return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }

function Markdown({ text }: { text: string }) {
    return <div className="space-y-2 text-[13.5px] leading-[1.72] whitespace-pre-wrap break-words">
        {text.split('\n').map((line, index) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={index} className="h-1" />;
            if (/^[-*•] /.test(trimmed)) return <div key={index} className="flex gap-2"><span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#28A9E8]" /><span>{trimmed.slice(2)}</span></div>;
            return <p key={index}>{line}</p>;
        })}
    </div>;
}

function Bubble({ message, retry }: { message: Message; retry?: () => void }) {
    const user = message.role === 'user';
    return <motion.div initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className={`flex gap-3 ${user ? 'justify-end' : 'justify-start'}`}>
        {!user && <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.09] bg-[#1b1d1f] shadow-[0_5px_18px_rgba(0,0,0,0.3)]"><Bot className="h-4 w-4 text-[#28A9E8]" /></div>}
        <div className={`flex max-w-[84%] flex-col gap-1 ${user ? 'items-end' : 'items-start'}`}>
            <div className={user ? 'rounded-2xl rounded-tr-md border border-[#28A9E8]/25 bg-[#173347] px-4 py-3 text-white shadow-[0_8px_26px_rgba(0,0,0,0.24)]' : message.error ? 'rounded-2xl rounded-tl-md border border-red-400/20 bg-red-400/[0.07] px-4 py-3 text-red-200' : 'rounded-2xl rounded-tl-md border border-white/[0.08] bg-[#191b1d] px-4 py-3 text-white/[0.9] shadow-[0_8px_26px_rgba(0,0,0,0.16)]'}>
                {user ? <p className="whitespace-pre-wrap text-[13.5px] leading-6">{message.content}</p> : message.error ? <div className="space-y-2"><div className="flex gap-2"><AlertCircle className="mt-1 h-4 w-4 shrink-0" /><p className="text-[13.5px] leading-6">{message.content}</p></div>{retry && <button onClick={retry} className="inline-flex items-center gap-1 text-xs underline underline-offset-2"><RotateCcw className="h-3 w-3" /> Try again</button>}</div> : <Markdown text={message.content} />}
            </div>
            <span className="px-1 text-[10px] text-white/25">{formatTime(message.timestamp)}</span>
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
                const parsed = JSON.parse(saved).map((message: Message) => ({ ...message, timestamp: new Date(message.timestamp) }));
                if (Array.isArray(parsed) && parsed.length) { setMessages(parsed); return; }
            }
        } catch {}
        setMessages([{ id: createId(), role: 'assistant', content: `Hi, I’m the portfolio assistant. I can help you explore ${portfolioData.personal.name}’s skills, projects, experience, education, certifications, and technologies. What would you like to know?`, timestamp: new Date() }]);
    }, []);

    useEffect(() => { if (messages.length) sessionStorage.setItem('portfolio-chat-messages', JSON.stringify(messages)); }, [messages]);

    useEffect(() => {
        const handler = () => { setOpen(true); setExpanded(false); window.setTimeout(() => inputRef.current?.focus(), 150); };
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
        const frame = window.requestAnimationFrame(() => window.setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 20));
        return () => window.cancelAnimationFrame(frame);
    }, [open, messages.length, loading]);

    const close = useCallback(() => { abortRef.current?.abort(); setLoading(false); setOpen(false); }, []);

    const send = useCallback(async (raw: string) => {
        const text = raw.trim();
        if (!text || loading) return;
        setInput(''); setLastUser(text);
        const user: Message = { id: createId(), role: 'user', content: text, timestamp: new Date() };
        const history = [...messages.filter(message => !message.error), user].slice(-20).map(({ role, content }) => ({ role, content }));
        setMessages(previous => [...previous, user]); setLoading(true);
        abortRef.current?.abort(); abortRef.current = new AbortController();
        try {
            const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history, locale }), signal: abortRef.current.signal });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data?.error || 'The AI assistant is temporarily unavailable. Please try again.');
            if (!data?.reply) throw new Error('The AI assistant returned an empty response.');
            setMessages(previous => [...previous, { id: createId(), role: 'assistant', content: data.reply, timestamp: new Date() }]);
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') return;
            setMessages(previous => [...previous, { id: createId(), role: 'assistant', content: error instanceof Error ? error.message : 'Unable to process the request right now.', error: true, timestamp: new Date() }]);
        } finally { setLoading(false); }
    }, [locale, loading, messages]);

    const retry = useCallback(() => { if (!lastUser) return; setMessages(previous => previous[previous.length - 1]?.error ? previous.slice(0, -1) : previous); send(lastUser); }, [lastUser, send]);

    return <AnimatePresence>
        {open && <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none fixed inset-0 z-[90] bg-black/[0.06]" />
            <motion.div ref={panelRef} initial={{ opacity: 0, scale: 0.95, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 14 }} transition={{ type: 'spring', stiffness: 330, damping: 28 }} className={`fixed z-[100] ${expanded ? 'inset-4 md:inset-8' : 'bottom-5 right-5 md:bottom-8 md:right-8 w-[min(520px,calc(100vw-2rem))] h-[min(700px,calc(100vh-2rem))]'} flex flex-col overflow-hidden rounded-[28px] border border-white/[0.12] bg-[#0c0d0f]/[0.98] shadow-[0_30px_100px_rgba(0,0,0,0.78)] backdrop-blur-2xl`}>
                <div className="relative shrink-0 overflow-hidden border-b border-white/[0.08] bg-[#111315] px-5 py-4">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(40,169,232,0.12),transparent_32%),linear-gradient(120deg,rgba(255,255,255,0.035),transparent_48%)]" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#28A9E8]/25 to-transparent" />
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.10] bg-[#171a1d] shadow-[0_7px_24px_rgba(0,0,0,0.32)]"><Bot className="h-5 w-5 text-[#28A9E8]" /><span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#111315] bg-[#28A9E8] shadow-[0_0_10px_rgba(40,169,232,0.5)]" /></div>
                            <div><div className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em] text-white">Portfolio Assistant <Sparkles className="h-3.5 w-3.5 text-[#28A9E8]" /></div><p className="mt-0.5 text-[11px] text-white/40">AI assistant <span className="px-1 text-white/20">•</span> Ask about Arham</p></div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button type="button" onClick={() => setExpanded(value => !value)} className="flex h-9 w-9 items-center justify-center rounded-xl text-white/35 transition hover:bg-white/[0.07] hover:text-white" aria-label={expanded ? 'Minimize' : 'Expand'}>{expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}</button>
                            <button type="button" onClick={close} className="flex h-9 w-9 items-center justify-center rounded-xl text-white/35 transition hover:bg-white/[0.07] hover:text-white" aria-label="Close chat"><X className="h-5 w-5" /></button>
                        </div>
                    </div>
                </div>
                <div className="portfolio-chat-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-5" data-lenis-prevent>
                    <div className="space-y-5">
                        <div className="rounded-2xl border border-white/[0.07] bg-[#121517] p-4 shadow-[0_6px_24px_rgba(0,0,0,0.12)]"><div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#28A9E8]/10"><Check className="h-3 w-3 text-[#28A9E8]" /></span> Portfolio aware</div><p className="mt-2 text-xs leading-5 text-white/35">Ask about Arham’s portfolio, or use it as a normal AI assistant for general questions.</p></div>
                        {messages.map((message, index) => <Bubble key={message.id} message={message} retry={message.error && index === messages.length - 1 ? retry : undefined} />)}
                        {loading && <div className="flex items-center gap-3 text-xs text-white/40"><div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.09] bg-[#17191b]"><Bot className="h-4 w-4 text-[#28A9E8]" /></div><div className="flex items-center gap-2"><span className="flex gap-1"><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#28A9E8]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#28A9E8] [animation-delay:120ms]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#28A9E8] [animation-delay:240ms]" /></span> Thinking…</div></div>}
                        {messages.length <= 1 && !loading && <div className="grid grid-cols-1 gap-2">{suggestions.map(question => <button key={question} type="button" onClick={() => send(question)} className="group flex items-center rounded-xl border border-white/[0.07] bg-[#111315] px-3.5 py-3 text-left text-xs text-white/45 transition hover:border-[#28A9E8]/25 hover:bg-[#151a1d] hover:text-white"><span className="mr-2 text-[#28A9E8]/80 transition group-hover:translate-x-0.5">→</span>{question}</button>)}</div>}
                        <div ref={bottomRef} className="h-px w-full" />
                    </div>
                </div>
                <div className="shrink-0 border-t border-white/[0.08] bg-[#0b0d0f] p-4">
                    <div className="flex items-end gap-2 rounded-2xl border border-white/[0.09] bg-[#141719] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition focus-within:border-[#28A9E8]/35 focus-within:bg-[#171a1d]">
                        <textarea ref={inputRef} value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(input); } }} rows={1} disabled={loading} placeholder="Ask me anything…" className="min-h-10 max-h-28 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-white/25 disabled:opacity-50" />
                        <button type="button" onClick={() => send(input)} disabled={!input.trim() || loading} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#28A9E8] text-[#071017] transition hover:bg-[#53bced] hover:shadow-[0_0_20px_rgba(40,169,232,0.2)] disabled:cursor-not-allowed disabled:opacity-25" aria-label="Send"><ArrowUp className="h-[18px] w-[18px]" /></button>
                    </div>
                    <p className="mt-2 text-center text-[10px] text-white/20">Enter to send <span className="px-1">•</span> Shift + Enter for a new line</p>
                </div>
                <style jsx>{`
                    .portfolio-chat-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(40,169,232,0.45) transparent; overscroll-behavior: contain; }
                    .portfolio-chat-scrollbar::-webkit-scrollbar { width: 6px; }
                    .portfolio-chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .portfolio-chat-scrollbar::-webkit-scrollbar-thumb { background: rgba(40,169,232,0.35); border-radius: 999px; border: 1px solid transparent; background-clip: padding-box; }
                    .portfolio-chat-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(40,169,232,0.7); }
                `}</style>
            </motion.div>
        </>}
    </AnimatePresence>;
}
