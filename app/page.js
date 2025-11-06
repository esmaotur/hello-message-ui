"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3001/api/v1";

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [newMsg, setNewMsg]     = useState("");

  async function load() {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/messages`);
      setMessages(res.data?.data || res.data || []);
      setError("");
    } catch (e) {
      setError("Mesajlar alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function sendMessage(e) {
    e.preventDefault();
    if (!newMsg.trim()) return;
    try {
      await axios.post(`${API}/messages`, {
        message: {
          content: newMsg.trim(),
          user_id: 1,          // demo
          category_id: 1,      // demo
          conversation_id: 1   // demo
        }
      });
      setNewMsg("");
      await load();
    } catch {
      alert("Mesaj gönderilemedi.");
    }
  }

  async function react(messageId, type) {
    try {
      await axios.post(`${API}/messages/${messageId}/reactions`, {
        reaction: { reaction_type: type, user_id: 1 }
      });
      await load();
    } catch {
      alert("Tepki eklenemedi.");
    }
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logo}>💬 Hello Message System</div>
        <div style={styles.badge}>Rails API + Next.js</div>
      </header>

      <section style={styles.card}>
        <h2 style={styles.title}>Yeni Mesaj</h2>
        <form onSubmit={sendMessage} style={styles.formRow}>
          <input
            style={styles.input}
            placeholder="Mesaj yaz..."
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
          />
          <button style={styles.button} type="submit">Gönder</button>
        </form>
      </section>

      <section style={styles.card}>
        <h2 style={styles.title}>Mesajlar</h2>

        {loading && <p style={styles.muted}>⏳ Yükleniyor...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {!loading && messages.length === 0 && (
          <p style={styles.muted}>Hiç mesaj yok. İlk mesajı sen yaz! ✨</p>
        )}

        <ul style={styles.list}>
          {messages.map((m) => (
            <li key={m.id} style={styles.item}>
              <div style={styles.itemHead}>
                <span style={styles.avatar}>{(m.user?.name || "U").charAt(0)}</span>
                <div>
                  <div style={styles.name}>{m.user?.name || "Bilinmeyen"}</div>
                  <div style={styles.meta}>
                    🗂 {m.category?.name || "Kategori yok"} • 💬 Konuşma #{m.conversation_id}
                  </div>
                </div>
              </div>

              <p style={styles.content}>{m.content}</p>

              <div style={styles.actions}>
                <button style={styles.chip} onClick={() => react(m.id, "👍")}>👍</button>
                <button style={styles.chip} onClick={() => react(m.id, "❤️")}>❤️</button>
                <button style={styles.chip} onClick={() => react(m.id, "🤔")}>🤔</button>
                <span style={styles.reactions}>
                  {Array.isArray(m.reactions) && m.reactions.length > 0
                    ? `Reaksiyonlar: ${m.reactions.map(r => r.reaction_type).join(" ")}`
                    : "Reaksiyon yok"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer style={styles.footer}>
        Hazırlayan: <strong>Esma Otur</strong> • API: <code>localhost:3001</code>
      </footer>
    </main>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f6f7fb", padding: "32px" },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: 24
  },
  logo: { fontSize: 22, fontWeight: 700 },
  badge: {
    background: "#eef", color: "#334", padding: "6px 12px",
    borderRadius: 999, fontSize: 13, border: "1px solid #dde"
  },
  card: {
    background: "#fff", border: "1px solid #e6e8ee",
    borderRadius: 14, padding: 18, marginBottom: 16,
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
  },
  title: { margin: 0, fontSize: 18, marginBottom: 12 },
  formRow: { display: "flex", gap: 8, marginTop: 8 },
  input: {
    flex: 1, padding: "10px 12px", borderRadius: 10,
    border: "1px solid #d8dbe5", outline: "none"
  },
  button: {
    padding: "10px 14px", borderRadius: 10, border: "1px solid #cdd1df",
    background: "#5b7cff", color: "white", cursor: "pointer"
  },
  list: { listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 },
  item: {
    border: "1px solid #eceff6", borderRadius: 12, padding: 14, background: "#fafbff"
  },
  itemHead: { display: "flex", gap: 12, alignItems: "center" },
  avatar: {
    width: 36, height: 36, borderRadius: "50%", background: "#e6eaff",
    border: "1px solid #dbe0ff", display: "grid", placeItems: "center", fontWeight: 700
  },
  name: { fontWeight: 600, marginBottom: 2 },
  meta: { fontSize: 12, color: "#667085" },
  content: { marginTop: 8, marginBottom: 10 },
  actions: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" },
  chip: {
    border: "1px solid #d3d7ea", background: "#fff", borderRadius: 999,
    padding: "6px 10px", cursor: "pointer"
  },
  reactions: { fontSize: 13, color: "#545b6a", marginLeft: 6 },
  muted: { color: "#6b7280" },
  error: { color: "#b42318" },
  footer: { marginTop: 16, fontSize: 13, color: "#6b7280" }
};
