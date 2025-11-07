
import React, { useState, useRef, useEffect } from 'react';
import { ChatBubbleIcon, CloseIcon, SendIcon } from './icons';
import { chatWithBot } from '../services/geminiService';

interface Message {
    role: 'user' | 'model' | 'error';
    content: string;
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', content: "SKU-Bot online. How can I assist your global sourcing operations today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
            const botResponse = await chatWithBot(input);
            setMessages(prev => [...prev, { role: 'model', content: botResponse }]);
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
    
    // Basic markdown to HTML - for demonstration purposes
    const renderMarkdown = (text: string) => {
        const html = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code class="bg-dark-gray text-primary-cyan px-1 rounded">$1</code>')
            .replace(/\n/g, '<br />');
        return { __html: html };
    };

    return (
        <>
            <div className={`fixed bottom-6 right-6 z-50 transition-transform duration-300 ${isOpen ? 'scale-0' : 'scale-100'}`}>
                <button 
                    onClick={() => setIsOpen(true)}
                    className="bg-primary-cyan text-black p-4 rounded-full shadow-brutalist-cyan hover:scale-110 transition-transform"
                    aria-label="Open Chatbot"
                >
                    <ChatBubbleIcon />
                </button>
            </div>

            <div className={`fixed bottom-6 right-6 z-50 w-[90vw] max-w-md h-[70vh] bg-dark-bg border-2 border-primary-cyan shadow-brutalist-cyan flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                <header className="flex justify-between items-center p-3 border-b-2 border-primary-cyan bg-black/30">
                    <h3 className="text-lg font-bold text-primary-lime">SKU-BOT ASSISTANT</h3>
                    <button onClick={() => setIsOpen(false)} className="text-primary-lime hover:text-white" aria-label="Close Chatbot">
                        <CloseIcon />
                    </button>
                </header>

                <div className="flex-grow p-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                                msg.role === 'user' ? 'bg-primary-cyan text-black' : 
                                msg.role === 'model' ? 'bg-dark-gray' : 'bg-red-500/20 text-red-300 border border-red-500'
                            }`}>
                                <p dangerouslySetInnerHTML={renderMarkdown(msg.content)} />
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start mb-4">
                            <div className="max-w-[80%] p-3 rounded-lg bg-dark-gray flex items-center gap-2">
                                <span className="animate-pulse">...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-3 border-t-2 border-primary-cyan flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Message SKU-Bot..."
                        className="w-full bg-black/20 p-2 border border-dark-gray focus:border-primary-lime outline-none"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading} className="bg-primary-lime text-black p-2 disabled:bg-dark-gray">
                        <SendIcon />
                    </button>
                </div>
            </div>
        </>
    );
};

export default Chatbot;
