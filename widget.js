(function () {
  const BACKEND_URL = "https://annaartyakusheva-ai-family-law-cons-backend-5045.twc1.net";
  const FULL_CONSULTANT_URL = "https://annaartyakusheva-ai-family-law-consultant-229c.twc1.net";

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

  const chat = document.createElement("div");

  Object.assign(chat.style, {
    position: "fixed",
    bottom: "90px",
    right: "20px",
    width: "340px",
    height: "440px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    display: "none",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 9999,
  });

  chat.innerHTML = `
    <div style="padding:12px;background:#2563eb;color:#fff;font-weight:600;font-size:14px;line-height:1.3;">
      Вызов AI-агента юриста по семейному праву
    </div>

    <div id="messages" style="flex:1;padding:10px;overflow:auto;"></div>

    <div style="padding:0 10px 10px;">
      <a
        href="${FULL_CONSULTANT_URL}"
        target="_blank"
        rel="noopener noreferrer"
        style="display:block;padding:10px;border-radius:10px;background:#eef2ff;color:#2563eb;text-align:center;text-decoration:none;font-size:13px;font-weight:600;"
      >
        Открыть полный AI-консультант
      </a>
    </div>

    <div style="display:flex;border-top:1px solid #eee;">
      <input
        id="input"
        style="flex:1;padding:10px;border:none;outline:none;color:#111827;background:#fff;"
        placeholder="Ваш вопрос..."
      />
      <button
        id="send"
        style="padding:10px 14px;border:none;background:#2563eb;color:#fff;cursor:pointer;"
      >
        ➤
      </button>
    </div>
  `;

  document.body.appendChild(chat);

  button.onclick = () => {
    chat.style.display = chat.style.display === "none" ? "flex" : "none";
  };

  const messages = chat.querySelector("#messages");
  const input = chat.querySelector("#input");
  const send = chat.querySelector("#send");

  let typingDiv;

  function addMessage(text, isUser) {
    const div = document.createElement("div");

    div.textContent = text.length > 500 ? text.slice(0, 500) + "..." : text;

    Object.assign(div.style, {
      marginBottom: "8px",
      padding: "8px 10px",
      borderRadius: "10px",
      maxWidth: "85%",
      fontSize: "13px",
      lineHeight: "1.4",
      color: isUser ? "#fff" : "#111827",
      background: isUser ? "#2563eb" : "#f1f5f9",
      marginLeft: isUser ? "auto" : "0",
      marginRight: isUser ? "0" : "auto",
    });

    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    typingDiv = document.createElement("div");
    typingDiv.textContent = "Печатает...";

    Object.assign(typingDiv.style, {
      fontSize: "12px",
      color: "#64748b",
      marginBottom: "6px",
    });

    messages.appendChild(typingDiv);
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTyping() {
    if (typingDiv) {
      typingDiv.remove();
      typingDiv = null;
    }
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, true);
    input.value = "";

    showTyping();

    try {
      const res = await fetch(`${BACKEND_URL}/api/llm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Отвечай только на русском языке. Отвечай кратко, до 5 предложений. Ты демонстрационный AI-агент по семейному праву РФ. В конце мягко предложи открыть полный AI-консультант для более точного разбора. Вопрос пользователя: ${text}`,
        }),
      });

      const data = await res.json();

      hideTyping();
      addMessage(data.text || "Ошибка ответа", false);
    } catch (e) {
      hideTyping();
      addMessage("Ошибка соединения", false);
    }
  }

  send.onclick = sendMessage;

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  addMessage(
    "Здравствуйте! Это демо AI-агента по семейному праву РФ. Для полноценного разбора откройте полный AI-консультант.",
    false
  );
})();