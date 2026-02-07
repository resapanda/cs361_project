import React from 'react';

const DeletePopup = ({ isOpen, onClose, onConfirm, itemName, messageType }) => {
    if (!isOpen) return null;

    // Customize the text based on the prop
    const isProfile = messageType === "profile";
    const isCheckIn = messageType === "daily_checkin";
    
    const titleText = isProfile
        ? `Delete ${itemName}?`
        : isCheckIn
          ? `Delete Daily Check-In?`
          : `Delete Vet Record?`;

    const bodyText = isProfile 
        ? `Are you sure you want to delete ${itemName}’s profile? This action will permanently delete all health records associated with this pet.`
        : `Are you sure you want to delete this ${isCheckIn ? 'daily check-in' : 'vet'} record? This action cannot be undone.`;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">{titleText}</h2>
                <p className="modal-text">{bodyText}</p>
                <div className="modal-actions">
                    <button className="modal-btn cancel" onClick={onClose}>Cancel</button>
                    <button className="modal-btn delete" onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    );
};
export default DeletePopup;
