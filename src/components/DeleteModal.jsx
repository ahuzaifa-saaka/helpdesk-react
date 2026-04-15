import {useState} from "react";

export default function DeleteModal({isOpen, ticket, onClose, onConfirm}) {
  const [inputId, setInputId] = useState("");

  function handleConfirm() {
    onConfirm(Number(inputId));
    setInputId("");
  }

  function handleClose() {
    setInputId("");
    onClose();
  }

  if (!isOpen || !ticket) return null;

  return (
    <div
      className="deleteModal active"
      id="deleteModal"
      onClick={(e) => {
        if (e.target.id === "deleteModal") handleClose();
      }}
    >
      <div className="deleteCard">
        <h3>Confirm Delete</h3>
        <p id="delete-text">
          Confirm deletion of '{ticket.title}' (ID: {ticket.id}). This action
          cannot be undone.
        </p>
        <input
          type="text"
          placeholder="Delete ticket by id"
          id="delete-input"
          autoComplete="off"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
        />
        <div className="buttons">
          <button id="cancelDeleteBtn" onClick={handleClose}>
            Cancel
          </button>
          <button id="confirmDeleteBtn" onClick={handleConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
