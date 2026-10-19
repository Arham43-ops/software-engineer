'use client';

import { PortfolioChatBot } from './PortfolioChatBot';

export function ChatBot({ headless: _headless = false }: { headless?: boolean }) {
    return <PortfolioChatBot />;
}
