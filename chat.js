(function () {
  // Inject CSS
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = "https://cdn.jsdelivr.net/gh/DoubleWeb-BV/chatbot@main/chat.css";
  document.head.appendChild(style);

  // Inject HTML
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <button class="chat-toggle" id="chatOpenButton">
      <img src="https://i.imgur.com/Z6Z1Hq2.png" alt="Chat openen">
    </button>
    <div class="chat-box" id="chatBox">
      <div class="chat-messages" id="chatMessages"></div>
      <form class="chat-footer" id="chatForm">
        <input type="text" id="chatInput" placeholder="Typ je bericht..." required />
        <button type="submit">Verstuur</button>
      </form>
    </div>
  `;
  document.body.appendChild(wrapper);

  // Open chat toggle
  document.getElementById("chatOpenButton").addEventListener("click", function () {
    document.getElementById("chatBox").style.display = "flex";
  });

  // Chat logic
  const form = document.getElementById("chatForm");
  const chat = document.getElementById("chatMessages");
  const input = document.getElementById("chatInput");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;

    // User bubble
    const userBubble = document.createElement("div");
    userBubble.className = "chat-bubble user-message";
    userBubble.textContent = message;
    chat.appendChild(userBubble);
    chat.scrollTop = chat.scrollHeight;
    input.value = "";

    // Fetch response
    try {
      const response = await fetch("https://workflows.draadwerk.nl/webhook/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: message })
      });

      const data = await response.json();

      const botBubble = document.createElement("div");
      botBubble.className = "chat-bubble bot-message";
      botBubble.innerHTML = data.text || "Geen antwoord ontvangen.";
      chat.appendChild(botBubble);
      chat.scrollTop = chat.scrollHeight;
    } catch {
      const errBubble = document.createElement("div");
      errBubble.className = "chat-bubble bot-message";
      errBubble.textContent = "⚠️ Er ging iets mis bij het ophalen van het antwoord.";
      chat.appendChild(errBubble);
      chat.scrollTop = chat.scrollHeight;
    }
  });
})();
