(function () {
  const BACKEND_URL = "https://annaartyakusheva-ai-family-law-cons-backend-5045.twc1.net";
  // --- кнопка ---
  const button = document.createElement("div");
  button.innerHTML = "💬";
  Object.assign(button.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    cursor: "pointer",
    zIndex: 9999,
  });

  document.body.appendChild(button);

  // --- окно чата ---
  const chat = document.createElement("div");
  Object.assign(chat.style, {
    position: "fixed",
    bottom: "90px",
    right: "20px",
    width: "320px",
    height: "400px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    display: "none",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 9999,
  });

  chat.innerHTML = `
    <div style="padding:10px;background:#2563eb;color:#fff;">
      AI-юрист
    </div>
    <div id="messages" style="flex:1;padding:10px;overflow:auto;"></div>
    <div style="display:flex;border-top:1px solid #eee;">
      <input id="input" style="flex:1;padding:10px;border:none;outline:none;color:#111827;background:#fff;" placeholder="Ваш вопрос..." />
      <button id="send" style="padding:10px 14px;border:none;background:#2563eb;color:#fff;cursor:pointer;">➤</button>
    </div>
  `;

  document.body.appendChild(chat);

  // --- логика открытия ---
  button.onclick = () => {
    chat.style.display = chat.style.display === "none" ? "flex" : "none";
  };

  const messages = chat.querySelector("#messages");
  const input = chat.querySelector("#input");
  const send = chat.querySelector("#send");

  addMessage("Здравствуйте! Опишите вашу ситуацию по семейному праву, и я подскажу, какие вопросы стоит обсудить с юристом.", false);

  function addMessage(text, isUser) {
    const div = document.createElement("div");
    div.textContent = text;
    div.style.marginBottom = "8px";
    div.style.padding = "8px 10px";
    div.style.borderRadius = "10px";
    div.style.maxWidth = "85%";
    div.style.fontSize = "14px";
    div.style.lineHeight = "1.4";
    div.style.color = isUser ? "#fff" : "#111827";
    div.style.background = isUser ? "#2563eb" : "#f1f5f9";
    div.style.marginLeft = isUser ? "auto" : "0";
    div.style.marginRight = isUser ? "0" : "auto";

    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, true);
    input.value = "";

    try {
      const res = await fetch(`${BACKEND_URL}/api/llm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: text,
        }),
      });

      const data = await res.json();
      addMessage(data.text || "Ошибка ответа", false);
    } catch (e) {
      addMessage("Ошибка соединения", false);
    }
  }

  send.onclick = sendMessage;
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
})();