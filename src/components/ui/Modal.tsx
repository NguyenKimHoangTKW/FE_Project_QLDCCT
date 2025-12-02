import React from "react";

interface ModalProps {
    isOpen: boolean;
    title?: string;
    children: React.ReactNode;
    onClose: () => void;
    onSave?: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, children, onClose, onSave }) => {
    if (!isOpen) return null;

    return (
        <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            style={{
                background: "rgba(0,0,0,0.5)",
                overflowY: "auto" // quan trọng để allow scroll tổng thể
            }}
        >
            <div
                className="modal-dialog modal-xl"
                role="document"
                style={{
                    maxHeight: "90vh",  // modal không vượt quá 90% màn hình
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <div className="modal-content" style={{ maxHeight: "90vh" }}>
                    <div className="modal-header">
                        <h5 className="modal-title h4 mb-0">{title}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>

                    {/* 📌 Modal body có scroll riêng */}
                    <div
                        className="modal-body"
                        style={{
                            overflowY: "auto",
                            maxHeight: "70vh",  // nội dung cuộn bên trong
                            paddingRight: "10px"
                        }}
                    >
                        {children}
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-ceo-butterfly"
                            onClick={onClose}
                        >
                            Đóng
                        </button>
                        {onSave && (
                            <button
                                type="button"
                                className="btn btn-ceo-blue"
                                onClick={onSave}
                            >
                                Lưu dữ liệu
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
