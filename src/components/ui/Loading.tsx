import React from "react";

interface LoadingProps {
  isOpen: boolean;
}

const Loading: React.FC<LoadingProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div
      id="loading-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(255,255,255,0.8)",
        zIndex: 9999,
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden" />
        </div>
        <p
          style={{
            marginTop: 15,
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Quá trình này có thể mất vài phút, vui lòng không đóng trình duyệt...
        </p>
      </div>
    </div>
  );
};

export default Loading;
