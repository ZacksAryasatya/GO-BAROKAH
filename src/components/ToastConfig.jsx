import { Toaster } from "react-hot-toast";

const ToastConfig = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          background: "#ffffff",
          color: "#1a1a1a",
          borderRadius: "16px",
          padding: "12px 20px",
          fontSize: "14px",
          fontWeight: "600",
          border: "1px solid #f0f0f0",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
        },
        success: {
          iconTheme: { primary: "#2D5A43", secondary: "#fff" },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#fff" },
        },
      }}
    />
  );
};

export default ToastConfig;