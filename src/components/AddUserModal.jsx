import {useForm} from "react-hook-form";
import {useEffect} from "react";
import {createPortal} from "react-dom";

const roles = ["agent", "user", "admin"];

export default function AddUserModal({onClose, isOpen, onSubmit}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({defaultValues: {name: "", email: "", password: "", role: ""}});

  useEffect(() => {
    if (isOpen) reset({name: "", email: "", password: "", role: ""});
  }, [isOpen, reset]);

  function handleClose() {
    reset();
    onClose();
  }
  function onValid(data) {
    onSubmit(data);
    reset();
  }
  if (!isOpen) return null;
  return createPortal(
    <div
      className="popUp active"
      id="addUserModal"
      onClick={(e) => {
        if (e.target.id === "addUserModal") handleClose();
      }}
    >
      <div className="form-card" style={{maxWidth: 380}}>
        <span className="close" onClick={handleClose}>
          &times;
        </span>
        <h2>Add New User</h2>

        <form
          style={{display: "flex", flexDirection: "column"}}
          onSubmit={handleSubmit(onValid)}
        >
          <label htmlFor="user-name">Full Name</label>
          <input
            type="text"
            id="u-name"
            placeholder="e.g. Abu Huzaifa"
            {...register("name", {
              required: "Name is required",
            })}
            className={errors.name ? "input-error" : "input"}
          />

          <label htmlFor="user-email">Work Email</label>
          <input
            type="email"
            id="u-email"
            placeholder="work@company.com"
            {...register("email", {required: "email is required"})}
            className={errors.email ? "input-error" : "input"}
          />

          <label htmlFor="user-password">Temporary Password</label>
          <input
            type="password"
            id="u-password"
            placeholder="Min. 6 characters"
            {...register("password", {
              required: "Password is required",
              minLength: {value: 6, message: "Min. 6 characters"},
            })}
            className={errors.password ? "input-error" : "input"}
          />

          <label htmlFor="user-role">Role</label>
          <select
            id="user-role"
            {...register("role", {
              required: "role is required",
            })}
            className={errors.role ? "input-error" : "input"}
          >
            <option value="">Select a Role</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="submit-button"
            style={{marginTop: 8}}
          >
            Add User
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}
