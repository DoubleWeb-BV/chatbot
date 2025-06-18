(function() {
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'https://jouwserver.nl/chat-widget.css';
  document.head.appendChild(style);

  const html = `
    <div class="chat-widget" id="chatWidget">
      <div class="chat-toggle" onclick="document.getElementById('chatContainer').style.display = 'flex'">
        <img src="https://i.imgur.com/Z6Z1Hq2.png" alt="Chat openen" />
      </div>
      <div class="chat-box" id="chatContainer" style="display:none;">
        <div class="chat-messages" id="chatMessages"></div>
        <form class="chat-footer" id="chatForm">
          <input type="text" id="chatInput" placeholder="Typ je bericht..." required />
          <button type="submit">Verstuur</button>
        </form>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);

  const form = container.querySelector("#chatForm");
  const chat = container.querySelector("#chatMessages");
  const input = container.querySelector("#chatInput");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;

    const userBubble = document.createElement("div");
    userBubble.className = "chat-bubble user-message";
    userBubble.textContent = message;
    chat.appendChild(userBubble);
    chat.scrollTop = chat.scrollHeight;
    input.value = "";

    try {
      const response = await fetch("https://workflows.draadwerk.nl/webhook-test/chat", {
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
      errBubble.textContent = "⚠️ Er ging iets mis.";
      chat.appendChild(errBubble);
    }
  });
})();
