'use client';

import { useEffect } from 'react';

/**
 * Connects the existing CardNav Chat card to the global headless ChatBot.
 * The bridge deliberately uses the rendered card rather than duplicating the
 * navigation UI, so the portfolio keeps one source of truth for the design.
 */
export function ChatNavBridge() {
    useEffect(() => {
        const findChatCard = (): HTMLElement | null => {
            const candidates = Array.from(document.querySelectorAll<HTMLElement>('div'));
            return candidates.find((element) => {
                const heading = Array.from(element.querySelectorAll('h4')).find(
                    (node) => node.textContent?.trim() === 'Chat'
                );
                return Boolean(heading);
            }) ?? null;
        };

        const decorate = () => {
            const card = findChatCard();
            if (!card) return;

            card.dataset.chatTrigger = 'true';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', 'Open AI portfolio assistant');

            // Override the original disabled/locked presentation from CardNav.
            card.classList.remove('cursor-not-allowed', 'opacity-70');
            card.classList.add('cursor-pointer');
            card.style.cursor = 'pointer';
            card.style.opacity = '1';
            card.style.pointerEvents = 'auto';

            const description = Array.from(card.querySelectorAll('p')).find(
                (node) =>
                    node.textContent?.trim() === 'Coming soon to connect' ||
                    node.textContent?.trim() === 'AI portfolio assistant'
            );
            if (description) description.textContent = 'AI portfolio assistant';
        };

        const openChat = (card: HTMLElement) => {
            const rect = card.getBoundingClientRect();
            window.dispatchEvent(
                new CustomEvent('portfolio:toggle-chatbot', {
                    detail: {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2,
                    },
                })
            );
        };

        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null;
            const card = target?.closest<HTMLElement>('[data-chat-trigger]');
            if (!card) return;
            event.preventDefault();
            event.stopPropagation();
            openChat(card);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            const target = event.target as HTMLElement | null;
            const card = target?.closest<HTMLElement>('[data-chat-trigger]');
            if (!card) return;
            event.preventDefault();
            openChat(card);
        };

        decorate();
        const observer = new MutationObserver(decorate);
        observer.observe(document.body, { childList: true, subtree: true });

        document.addEventListener('click', handleClick, true);
        document.addEventListener('keydown', handleKeyDown, true);

        return () => {
            observer.disconnect();
            document.removeEventListener('click', handleClick, true);
            document.removeEventListener('keydown', handleKeyDown, true);
        };
    }, []);

    return null;
}
