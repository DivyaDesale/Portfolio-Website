/* =====================================================
   CHATBOT WIDGET LOGIC
   Handles interactions, animations, and AI-simulated responses
   ===================================================== */

'use strict';

const Chatbot = (() => {
    // --- Elements ---
    const bubble = document.getElementById('chatbot-bubble');
    const windowEl = document.getElementById('chatbot-window');
    const messagesContainer = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const typingIndicator = document.getElementById('typing-indicator');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');

    // --- State ---
    let isOpen = false;
    let isTyping = false;

    // --- Bot Persona & Knowledge ---
    const CONFIG = {
        PROXY_URL: "http://localhost:3000/chat",
    };

    const welcomeMsg = "Hi there! I'm Divya's AI assistant. I can tell you about her data projects, skills, or answer any general questions you have. How can I help you today?";

    const knowledgeBase = {
        projects: "Divya has worked on several impressive projects, including a Regression Analysis study in R/Studio and an Employee Database System in Python using Pandas.",
        skills: "Her technical toolkit includes Python (Pandas, NumPy), R Programming (Statistical Modeling), SQL, Excel, and Power BI. She's also strong in leadership and nature photography!",
        contact: "You can reach Divya via email at desaledivya.stat@gmail.com or connect with her on LinkedIn (link in the footer!).",
        education: "Divya is currently pursuing an M.Sc. in Statistics at MIT WPU, Pune (9.14 GPA). She holds a B.Sc. in Statistics with a 9.71 CGPI.",
        experience: "She served as the Secretary of the Sankhya Club (Statistics Club) and has experience in event management and leadership."
    };

    // --- Core Functions ---
    const toggleChat = () => {
        isOpen = !isOpen;
        bubble.classList.toggle('active', isOpen);
        windowEl.classList.toggle('active', isOpen);
        
        if (isOpen && messagesContainer.children.length === 1) { // Only typing indicator exists
           // show welcome message
           setTimeout(() => {
                showTyping(true);
                setTimeout(() => {
                    showTyping(false);
                    addMessage(welcomeMsg, 'bot');
                }, 1000);
           }, 500);
        }
    };

    const addMessage = (text, sender = 'bot') => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.textContent = text;
        
        // Insert before typing indicator
        messagesContainer.insertBefore(msgDiv, typingIndicator);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const showTyping = (show) => {
        isTyping = show;
        typingIndicator.style.display = show ? 'flex' : 'none';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const getAIResponse = async (userQuery) => {
        try {
            const response = await fetch(CONFIG.PROXY_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userQuery })
            });

            if (!response.ok) throw new Error("Server error");
            
            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error("Chatbot Error:", error);
            return "Apologies, I'm having trouble connecting to my brain! Please make sure the backend server is running.";
        }
    };

    const handleInput = async () => {
        const text = chatInput.value.trim();
        if (!text || isTyping) return;

        chatInput.value = '';
        addMessage(text, 'user');

        showTyping(true);
        
        const responseDelay = Math.max(1000, text.length * 40); 
        await new Promise(r => setTimeout(r, responseDelay));
        
        const response = await getAIResponse(text);
        showTyping(false);
        addMessage(response, 'bot');
    };

    // --- Init ---
    const init = () => {
        if (!bubble) return;

        bubble.addEventListener('click', toggleChat);
        sendBtn?.addEventListener('click', handleInput);
        chatInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleInput();
        });

        suggestionChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const text = chip.getAttribute('data-query') || chip.textContent;
                chatInput.value = text;
                handleInput();
                // Hide chips after first interaction
                document.querySelector('.chat-suggestions').style.opacity = '0';
                setTimeout(() => document.querySelector('.chat-suggestions').style.display = 'none', 300);
            });
        });
    };

    return { init };
})();

// Initialize
document.addEventListener('DOMContentLoaded', Chatbot.init);
