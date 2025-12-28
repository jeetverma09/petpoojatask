import React from 'react';
import Modal from '../modal/Modal';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="confirmation-content">
                <p>{message}</p>
                <div className="confirmation-actions">
                    <button className="btn-cancel" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </button>
                    <button className="btn-confirm-delete" onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
