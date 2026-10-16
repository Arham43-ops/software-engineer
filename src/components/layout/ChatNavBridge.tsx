'use client';

import { useEffect } from 'react';

/**
 * Turns the existing CardNav "Chat" card into the trigger for the global
 * headless ChatBot. The ChatBot already listens for portfolio:toggle-chatbot.
 * Keeping the bridge separate means the existing navigation animation/layout
 * stays untouched.
 */
export function ChatNavBridge() {
    useEffect(() => {
        const findChatCard = (): HTMLElement | null => {
            const candidates = Array.from(document.querySelectorAll<HTMLElement>('div'));
            return candidates.find((element) => {
                const heading = Array.from(element.querySelectorAll('h4')).find(
                    (node) => node.textContent?.trim() === 'Chat'
                );
                const description = Array.from(element.querySelectorAll('p')).find(
                    (node) => node.textContent?.trim() === 'Coming soon to connect'
                );
                return Boolean(heading && description);
            }) ?? null;
        };

        const decorate = () => {
            const card = findChatCard();
            if (!card) return;

            card.dataset.chatTrigger = 'true';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', 'Open AI portfolio assistant');
            card.classList.remove('cursor-not-allowed', 'opacity-70');
            card.classList.add('cursor-pointer');

            const description = Array.from(card.querySelectorAll('p')).find(
                (node) => node.textContent?.trim() === 'Coming soon to connect'
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
