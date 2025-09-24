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
            style={{ background: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title h4">{title}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">{children}</div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Đóng
                        </button>
                        {onSave && (
                            <button
                                type="button"
                                className="btn btn-primary"
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
