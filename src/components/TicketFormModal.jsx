import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useGlobal} from "../context/Appcontext";
import Spinner from "./Spinner";

export default function TicketFormModal({
  isOpen,
  onClose,
  onSubmit,
  editTicket,
}) {
  const {authLoading} = useGlobal();
  const isEdit = !!editTicket;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: "",
      status: "open",
      priority: "",
      email: "",
      description: "",
    },
  });

  useEffect(() => {
    if (editTicket) {
      reset({
        title: editTicket.title,
        priority: editTicket.priority,
        status: editTicket.status,
        email: editTicket.email,
        description: editTicket.description,
      });
    } else {
      reset({
        title: "",
        status: "open",
        priority: "",
        email: "",
        description: "",
      });
    }
  }, [editTicket, isOpen, reset]);

  async function onValid(data) {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
      reset();
    }
  }

  function handleClose() {
    if (isSubmitting) return;
    reset();
    onClose();
  }

  if (!isOpen) return null;

  if (authLoading) return <Spinner />;

  if (isSubmitting) {
    return (
      <div className="popUp active">
        <div
          className="form-card"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 300,
            gap: 16,
          }}
        >
          <Spinner size="small" />
          <p style={{color: "var(--text-muted)", fontSize: 14}}>
            {isEdit ? "Updating ticket…" : "Creating ticket…"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="popUp active"
      id="popupForm"
      onClick={(e) => {
        if (e.target.id === "popupForm") handleClose();
      }}
    >
      <div className="form-card">
        <span className="close" id="closeBtn" onClick={handleClose}>
          &times;
        </span>
        <h2 id="update-header">
          {isEdit ? "Update Support Ticket" : "Create Support Ticket"}
        </h2>

        <form
          id="ticketForm"
          style={{display: "flex", flexDirection: "column"}}
          onSubmit={handleSubmit(onValid)}
        >
          <label htmlFor="title">
            Title <span style={{color: "red"}}>*</span>
          </label>
          <input
            type="text"
            id="title"
            placeholder="Enter ticket title"
            {...register("title", {required: true})}
            className={errors.title ? "input-error" : "input"}
          />

          <label htmlFor="priority">
            Priority <span style={{color: "red"}}>*</span>
          </label>
          <select
            id="priority"
            {...register("priority", {required: "please select a priority"})}
            className={errors.priority ? "input-error" : "input"}
          >
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <label
            htmlFor="status"
            id="label-status"
            style={{display: isEdit ? "block" : "none"}}
          >
            Status <span style={{color: "red"}}>*</span>
          </label>
          <select
            id="status"
            {...register("status")}
            className={errors.status ? "input-error" : "input"}
            style={{display: isEdit ? "block" : "none"}}
          >
            <option value="open">Open</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="reopened">Reopened</option>
          </select>

          <label htmlFor="email">
            Email <span style={{color: "red"}}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="customer@email.com"
            {...register("email", {required: "Email is required"})}
            className={errors.email ? "input-error" : "input"}
          />

          <label htmlFor="description">
            Description <span style={{color: "red", fontSize: "10px"}}>*</span>
          </label>
          <textarea
            id="description"
            placeholder="Describe the issue…"
            {...register("description", {required: "description is required"})}
            className={errors.description ? "input-error" : "input"}
          />

          <button type="submit" className="submit-button" id="update-btn">
            {isEdit ? "Update Ticket" : "Create Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
}
