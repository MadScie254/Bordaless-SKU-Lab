
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChatBubbleIcon, CloseIcon, SendIcon } from './icons';
import { chatWithBot } from '../services/geminiService';
import { ProductBatch } from '../types';

interface Message {
    role: 'user' | 'model' | 'error' | 'function_result';
    content: string;
}

interface ChatbotProps {
    productContext: ProductBatch | null;
}

const Chatbot: React.FC<ChatbotProps> = ({ productContext }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { systemInstruction, initialMessage } = useMemo(() => {
        if (productContext) {
            return {
                systemInstruction: `You are a helpful assistant and negotiation expert for the Borderless SKU Lab. The user is currently viewing the product "${productContext.title}" which costs $${productContext.unitPriceUSD} per unit with an MOQ of ${productContext.moq}. Your name is 'SKU-Bot'. Your goal is to help the user draft a negotiation offer using the 'draftOffer' function. Be proactive in suggesting this. Be concise and professional, with a slightly futuristic, 'cyberpunk' tone.`,
                initialMessage: `SKU-Bot online. Analyzing "${productContext.title}". I can help you draft a negotiation offer. What quantity and price are you considering?`
            };
        }
        return {
            systemInstruction: "You are a helpful assistant for the Borderless SKU Lab, a B2B marketplace for handcrafted goods. Your name is 'SKU-Bot'. You can answer questions about the platform, sourcing, logistics, and help users find products. Be concise and professional, with a slightly futuristic, 'cyberpunk' tone. Use markdown for formatting.",
            initialMessage: "SKU-Bot online. How can I assist your global sourcing operations today?"
        };
    }, [productContext]);
    
    useEffect(() => {
        setMessages([{ role: 'model', content: initialMessage }]);
    }, [initialMessage]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        
        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const botResponse = await chatWithBot(input, systemInstruction);
            if (botResponse.startsWith('[FUNCTION_CALL]')) {
                const callData = JSON.parse(botResponse.replace('[FUNCTION_CALL] ', ''));
                const { name, args } = callData;
                if (name === 'draftOffer') {
                    const resultMessage: Message = {
                        role: 'function_result',
                        content: `Offer Drafted: ${args.quantity} units @ $${args.price.toFixed(2)}/unit. Total: $${(args.quantity * args.price).toFixed(2)}. Awaiting your confirmation to proceed.`
                    };
                    setMessages(prev => [...prev, resultMessage]);
                }
            } else {
                 setMessages(prev => [...prev, { role: 'model', content: botResponse }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'error', content: "System error. Connection to AI mainframe lost. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };
    
    const renderMarkdown = (text: string) => {
        const html = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code class="bg-surface-2 text-secondary px-1 rounded">$1</code>')
            .replace(/\n/g, '<br />');
        return { __html: html };
    };

    return (
        <>
            <div className={`fixed bottom-6 right-6 z-50 transition-transform duration-300 ${isOpen ? 'scale-0' : 'scale-100'}`}>
                <button 
                    onClick={() => setIsOpen(true)}
                    className="bg-secondary text-black p-4 rounded-full shadow-glow-secondary hover:scale-110 transition-transform"
                    aria-label="Open Chatbot"
                >
                    <ChatBubbleIcon />
                </button>
            </div>

            <div className={`fixed bottom-6 right-6 z-50 w-[90vw] max-w-md h-[70vh] bg-surface-glass backdrop-blur-lg border border-secondary/50 shadow-glow-secondary flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                <header className="flex justify-between items-center p-3 border-b border-secondary/50">
                    <h3 className="text-lg font-bold text-primary">SKU-BOT ASSISTANT</h3>
                    <button onClick={() => setIsOpen(false)} className="text-primary hover:opacity-80" aria-label="Close Chatbot">
                        <CloseIcon />
                    </button>
                </header>

                <div className="flex-grow p-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                                msg.role === 'user' ? 'bg-secondary text-black' : 
                                msg.role === 'model' ? 'bg-surface-2 text-text-base' :
                                msg.role === 'function_result' ? 'bg-primary/20 text-primary border border-primary' :
                                'bg-red-500/20 text-red-300 border border-red-500'
                            }`}>
                                <p dangerouslySetInnerHTML={renderMarkdown(msg.content)} />
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start mb-4">
                            <div className="max-w-[80%] p-3 rounded-lg bg-surface-2 flex items-center gap-2">
                                <span className="animate-pulse text-text-muted">...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-3 border-t border-secondary/50 flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Message SKU-Bot..."
                        className="w-full bg-surface-1 p-2 border border-border focus:border-primary outline-none text-text-base"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading} className="bg-primary text-black p-2 disabled:bg-surface-2 disabled:text-text-muted">
                        <SendIcon />
                    </button>
                </div>
            </div>
        </>
    );
};

export default Chatbot;
