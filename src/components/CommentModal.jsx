import {useState} from "react";

export default function CommentModal({isOpen, onClose, onSubmit}) {
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit() {
    onSubmit(author, message);
    setAuthor("");
    setMessage("");
  }

  function handleClose() {
    setAuthor("");
    setMessage("");
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      className="popUp active"
      id="commentModal"
      onClick={(e) => {
        if (e.target.id === "commentModal") handleClose();
      }}
    >
      <div className="form-card" style={{maxWidth: 400}}>
        <span className="close" id="closeCommentBtn" onClick={handleClose}>
          &times;
        </span>
        <h2>Add Comment</h2>

        <label htmlFor="commentAuthor">User Name</label>
        <input
          type="text"
          id="commentAuthor"
          placeholder="Agent name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{
            width: "100%",
            marginBottom: 12,
            padding: "10px 14px",
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            color: "var(--text)",
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 14,
            outline: "none",
          }}
        />

        <label htmlFor="commentMsg">Message</label>
        <textarea
          id="commentMsg"
          placeholder="Write your comment…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            width: "100%",
            minHeight: 100,
            marginBottom: 16,
            padding: "10px 14px",
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            color: "var(--text)",
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 14,
            outline: "none",
            resize: "vertical",
          }}
        />
        <button
          className="submit-button"
          id="submitCommentBtn"
          onClick={handleSubmit}
        >
          Post Comment
        </button>
      </div>
    </div>
  );
}
