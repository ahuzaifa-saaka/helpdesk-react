import {getUserName, formatStatus} from "../utils";
import {TRANSITIONS} from "../constants";
import {useGlobal} from "../context/Appcontext";

export default function TicketDetailModal({
  isOpen,
  ticket,
  onClose,
  onTransition,
  onAssign,
  onOpenComment,
}) {
  if (!isOpen || !ticket) return null;

  const userName = getUserName(ticket.assignedTo);
  const comments = ticket.comments || [];

  // function canTransition(next) {
  //   return (TRANSITIONS[ticket.status] || []).includes(next);
  // }

  return (
    <div
      className="popUp active"
      id="viewModal"
      onClick={(e) => {
        if (e.target.id === "viewModal") onClose();
      }}
    >
      <div className="form-card view-card">
        <span className="close" id="closeDetailBtn" onClick={onClose}>
          &times;
        </span>
        <div id="viewContent">
          <div style={{marginTop: 4}}>
            <div className="detail-title">Title: {ticket.title}</div>
            <div
              style={{
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <span className={`ticket-priority ${ticket.priority}`}>
                Priority: {ticket.priority}
              </span>
              <span className={`status ${ticket.status}`}>
                Status: {formatStatus(ticket.status)}
              </span>
            </div>

            <div className="detail-meta">
              <div className="meta-item">
                <div className="meta-label">Created</div>
                <div className="meta-value">
                  {ticket.createdAt || ticket.date || "-"}
                </div>
              </div>
              <div className="meta-item">
                <div className="meta-label">Email</div>
                <div className="meta-value" style={{wordBreak: "break-all"}}>
                  {ticket.email}
                </div>
              </div>
              <div className="meta-item">
                <div className="meta-label">Assigned To</div>
                <div className="meta-value">
                  {userName ? (
                    <span className="assignee-chip">
                      <span className="material-icons" style={{fontSize: 12}}>
                        person
                      </span>
                      {userName}
                    </span>
                  ) : (
                    <span className="unassigned">Unassigned</span>
                  )}
                </div>
              </div>
              <div className="meta-item">
                <div className="meta-label">Assigned At</div>
                <div className="meta-value">{ticket.assignedAt || "—"}</div>
              </div>
            </div>

            <div className="detail-section">
              <div className="meta-label" style={{marginBottom: 8}}>
                Description
              </div>
              <div className="detail-description">{ticket.description}</div>
            </div>

            {/* Action Buttons */}
            <div className="action-bar">
              {ticket.status === "open" && (
                <button
                  className="action-btn assign"
                  id={`action-assign-${ticket.id}`}
                  onClick={() => onAssign(ticket.id)}
                >
                  <span className="material-icons">assignment_ind</span> Assign
                  Ticket
                </button>
              )}
              {(ticket.status === "assigned" ||
                ticket.status === "reopened") && (
                <button
                  className="action-btn start"
                  id={`action-start-${ticket.id}`}
                  onClick={() => onTransition(ticket.id, "in-progress")}
                >
                  <span className="material-icons">play_arrow</span> Start Work
                </button>
              )}
              {ticket.status === "in-progress" && (
                <button
                  className="action-btn resolve"
                  id={`action-resolve-${ticket.id}`}
                  onClick={() => onTransition(ticket.id, "resolved")}
                >
                  <span className="material-icons">check_circle</span> Mark
                  Resolved
                </button>
              )}
              {ticket.status === "resolved" && (
                <>
                  <button
                    className="action-btn close-t"
                    id={`action-close-${ticket.id}`}
                    onClick={() => onTransition(ticket.id, "closed")}
                  >
                    <span className="material-icons">lock</span> Close Ticket
                  </button>
                  <button
                    className="action-btn reopen"
                    id={`action-reopen-${ticket.id}`}
                    onClick={() => onTransition(ticket.id, "reopened")}
                  >
                    <span className="material-icons">refresh</span> Reopen
                  </button>
                </>
              )}
            </div>

            {/* Comments */}
            <div
              className="comments-section"
              style={{height: "8rem", overflow: "auto"}}
            >
              <div className="comment-label">Comments {comments.length}</div>
              {comments.length ? (
                comments.map((comment, i) => (
                  <div className="comment-item" key={i}>
                    <div className="comment-header">
                      <span className="comment-author">
                        Author: {comment.author}
                      </span>
                      <span className="comment-time">{comment.createdAt}</span>
                    </div>
                    <div className="comment-body">{comment.message}</div>
                  </div>
                ))
              ) : (
                <div className="no-comments">No comments yet.</div>
              )}
              <button
                className="add-comment-btn"
                id="openCommentBtn"
                onClick={() => onOpenComment(ticket.id)}
              >
                <span className="material-icons" style={{fontSize: 15}}>
                  add_comment
                </span>{" "}
                Add Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
