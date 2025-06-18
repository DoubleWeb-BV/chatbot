(function () {
    const timestamp = Date.now(); // unieke waarde bij elke paginalaad

    // Load CSS
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = `https://cdn.jsdelivr.net/gh/DoubleWeb-BV/chatbot@main/chat.css?t=${timestamp}`;
    document.head.appendChild(style);

    // Load HTML
    fetch(`https://cdn.jsdelivr.net/gh/DoubleWeb-BV/chatbot@main/chat.html?t=${timestamp}`)
        .then(res => res.text())
        .then(html => {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = html;
            document.body.appendChild(wrapper);

            // Setup logic...
            document.getElementById("chatOpenButton").addEventListener("click", function () {
                document.getElementById("chatBox").style.display = "flex";
            });

            const form = document.getElementById("chatForm");
            const chat = document.getElementById("chatMessages");
            const input = document.getElementById("chatInput");

            function getTimestamp() {
                const now = new Date();
                return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }

            function appendBubble(text, type) {
                const bubble = document.createElement("div");
                bubble.className = `chat-bubble ${type}`;
                bubble.innerHTML = `<span>${text}</span><small class="chat-time">${getTimestamp()}</small>`;
                chat.appendChild(bubble);
                chat.scrollTop = chat.scrollHeight;
            }

            form.addEventListener("submit", async function (e) {
                e.preventDefault();
                const message = input.value.trim();
                if (!message) return;

                appendBubble(message, "user-message");
                input.value = "";

                try {
                    const response = await fetch("https://workflows.draadwerk.nl/webhook/chat", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ question: message })
                    });

                    const data = await response.json();
                    appendBubble(data.text || "Geen antwoord ontvangen.", "bot-message");
                } catch {
                    appendBubble("⚠️ Er ging iets mis.", "bot-message");
                }
            });
        });
})();
