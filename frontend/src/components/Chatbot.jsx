import { useState, useRef, useEffect, useCallback } from 'react';
import api from '../services/api';
import useTilt from '../hooks/useTilt';

const Chatbot = () => {
    const bubbleTilt = useTilt();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'bot',
            content: "Hi! I'm **LearnBot** 🎓 — your AI learning assistant.\n\nI can help you find courses, explain coding concepts, suggest learning paths, and more. How can I help you today?",
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const sendMessage = async (e) => {
        e?.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const { data } = await api.post('/chat', {
                message: userMessage,
                sessionId,
            });

            if (data.sessionId && !sessionId) {
                setSessionId(data.sessionId);
            }

            setMessages((prev) => [
                ...prev,
                { role: 'bot', content: data.response },
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'bot',
                    content: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🙏",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = async () => {
        if (sessionId) {
            try {
                await api.delete(`/chat/${sessionId}`);
            } catch (_) {}
        }
        setSessionId(null);
        setMessages([
            {
                role: 'bot',
                content: "Chat cleared! 🔄 I'm ready for a fresh start. What would you like to learn about?",
            },
        ]);
    };

    const quickActions = [
        { label: '🔍 Find courses', message: 'Help me find a good course to learn from' },
        { label: '🐍 Learn Python', message: 'I want to learn Python, where should I start?' },
        { label: '⚛️ React path', message: 'What is a good learning path for React development?' },
        { label: '💡 Study tips', message: 'Give me some effective study tips for learning programming' },
    ];

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 hover:scale-110 ${
                    isOpen
                        ? 'bg-surface-container-highest text-on-surface rotate-0'
                        : 'bg-gradient-primary text-white shadow-glow'
                }`}
                id="chatbot-toggle"
            >
                <span className="material-icons-round text-2xl transition-transform duration-300">
                    {isOpen ? 'close' : 'smart_toy'}
                </span>
            </button>

            {/* Unread indicator */}
            {!isOpen && (
                <div className="fixed bottom-[84px] right-6 z-50 animate-slide-up">
                    <div
                        ref={bubbleTilt.ref}
                        onMouseMove={bubbleTilt.onMouseMove}
                        onMouseLeave={bubbleTilt.onMouseLeave}
                        style={bubbleTilt.style}
                        className="card-elevated tilt-card !p-3 !rounded-2xl !rounded-br-sm max-w-[220px] cursor-pointer hover:shadow-ambient-lg transition-shadow"
                        onClick={() => setIsOpen(true)}
                    >
                        <p className="text-xs text-on-surface-variant">
                            <span className="font-semibold text-on-surface">LearnBot</span> — Need help finding a course? 👋
                        </p>
                    </div>
                </div>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[560px] max-h-[calc(100vh-120px)] rounded-3xl overflow-hidden shadow-ambient-lg flex flex-col animate-slide-up"
                    style={{ background: '#fcf8fe' }}
                    id="chatbot-window"
                >
                    {/* Header */}
                    <div className="bg-gradient-primary p-4 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <span className="material-icons-round text-white text-lg">smart_toy</span>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-sm">LearnBot</h3>
                                <p className="text-white/70 text-xs">AI Learning Assistant</p>
                            </div>
                        </div>
                        <button
                            onClick={clearChat}
                            className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white/80 hover:bg-white/25 hover:text-white transition-all"
                            title="Clear chat"
                            id="clear-chat-btn"
                        >
                            <span className="material-icons-round text-sm">refresh</span>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" id="chat-messages">
                        {messages.map((msg, i) => (
                            <ChatMessage key={i} message={msg} />
                        ))}

                        {loading && (
                            <div className="flex items-start gap-2">
                                <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="material-icons-round text-white text-xs">smart_toy</span>
                                </div>
                                <div className="card-tonal !p-3 !rounded-2xl !rounded-tl-sm">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions (shown when few messages) */}
                    {messages.length <= 2 && !loading && (
                        <div className="px-4 pb-2 flex-shrink-0">
                            <div className="flex flex-wrap gap-1.5">
                                {quickActions.map((action, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setInput(action.message);
                                            setTimeout(() => {
                                                setInput('');
                                                setMessages(prev => [...prev, { role: 'user', content: action.message }]);
                                                setLoading(true);
                                                api.post('/chat', { message: action.message, sessionId })
                                                    .then(({ data }) => {
                                                        if (data.sessionId && !sessionId) setSessionId(data.sessionId);
                                                        setMessages(prev => [...prev, { role: 'bot', content: data.response }]);
                                                    })
                                                    .catch(() => {
                                                        setMessages(prev => [...prev, { role: 'bot', content: "Sorry, something went wrong. Please try again! 🙏" }]);
                                                    })
                                                    .finally(() => setLoading(false));
                                            }, 50);
                                        }}
                                        className="px-3 py-1.5 rounded-xl text-xs font-medium bg-surface-container-high text-on-surface-variant hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
                                        id={`quick-action-${i}`}
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <form onSubmit={sendMessage} className="p-3 flex-shrink-0 bg-white/50 backdrop-blur-sm" id="chat-input-form">
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything about learning..."
                                className="flex-1 px-4 py-2.5 rounded-xl bg-surface-container-low text-sm text-on-surface outline-none focus:bg-white focus:shadow-sm transition-all duration-300 placeholder:text-on-surface-variant/60 font-[Manrope]"
                                disabled={loading}
                                id="chat-input"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white disabled:opacity-40 hover:shadow-glow transition-all duration-300 flex-shrink-0"
                                id="chat-send-btn"
                            >
                                <span className="material-icons-round text-lg">send</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

/**
 * Individual chat message bubble with basic markdown rendering.
 */
const ChatMessage = ({ message }) => {
    const isBot = message.role === 'bot';

    // Simple markdown to HTML conversion
    const formatContent = (text) => {
        return text
            // Code blocks
            .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs my-2 overflow-x-auto font-mono"><code>$2</code></pre>')
            // Inline code
            .replace(/`([^`]+)`/g, '<code class="bg-surface-container-high text-primary-600 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
            // Bold
            .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-on-surface">$1</strong>')
            // Italic
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            // Bullet lists
            .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-xs leading-relaxed">$1</li>')
            // Numbered lists
            .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-xs leading-relaxed">$1</li>')
            // Headers
            .replace(/^### (.+)$/gm, '<h4 class="font-semibold text-sm mt-2 mb-1">$1</h4>')
            .replace(/^## (.+)$/gm, '<h3 class="font-semibold text-sm mt-2 mb-1">$1</h3>')
            // Newlines to <br>
            .replace(/\n/g, '<br/>');
    };

    return (
        <div className={`flex items-start gap-2 ${isBot ? '' : 'flex-row-reverse'}`}>
            {isBot && (
                <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="material-icons-round text-white text-xs">smart_toy</span>
                </div>
            )}
            <div
                className={`max-w-[85%] px-3.5 py-2.5 text-xs leading-relaxed ${
                    isBot
                        ? 'card-tonal !rounded-2xl !rounded-tl-sm text-on-surface'
                        : '!rounded-2xl !rounded-tr-sm bg-gradient-primary text-white'
                }`}
                dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
            />
        </div>
    );
};

export default Chatbot;
