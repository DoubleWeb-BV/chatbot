(function () {
  // Inject CSS
  const style = document.createElement("style");
  style.textContent = `
    .chat-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      border: none;
      background: transparent;
      cursor: pointer;
    }
    .chat-toggle img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
    }
    .chat-box {
      position: fixed;
      bottom: 100px;
      right: 20px;
      width: 350px;
      height: 500px;
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.2);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 10000;
    }
    .chat-messages {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
      background: #f5f5f5;
    }
    .chat-bubble {
      padding: 15px 20px;
      border-radius: 20px;
      margin-bottom: 15px;
      max-width: 80%;
      clear: both;
      word-wrap: break-word;
    }
    .user-message {
      background: #ff5e18;
      color: white;
      float: right;
      text-align: right;
    }
    .bot-message {
      background: #f1f8f6;
      float: left;
      text-align: left;
    }
    .chat-footer {
      display: flex;
      border-top: 1px solid #ccc;
      background: #fafafa;
      padding: 10px;
    }
    .chat-footer input {
      flex: 1;
      padding: 10px;
      border-radius: 20px;
      border: 1px solid #ccc;
    }
    .chat-footer button {
      margin-left: 10px;
      padding: 10px 20px;
      border-radius: 20px;
      border: none;
      background-color: #128C7E;
      color: white;
      cursor: pointer;
    }
  `;
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

  // Open chat
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

    // Show user message
    const userBubble = document.createElement("div");
    userBubble.className = "chat-bubble user-message";
    userBubble.textContent = message;
    chat.appendChild(userBubble);
    chat.scrollTop = chat.scrollHeight;
    input.value = "";

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

    } catch (err) {
      const errBubble = document.createElement("div");
      errBubble.className = "chat-bubble bot-message";
      errBubble.textContent = "⚠️ Er ging iets mis bij het ophalen van het antwoord.";
      chat.appendChild(errBubble);
      chat.scrollTop = chat.scrollHeight;
    }
  });
})();
