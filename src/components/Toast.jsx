import {ToastContainer, toast} from "react-toastify";

export function showToast(message, type = "success") {
  toast[type]?.(message) ?? toast(message);
}

export default function Toast() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="dark"
    />
  );
}
