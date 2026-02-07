import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePopup = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container welcome-style">
                <h2 className="modal-title blue-text">Welcome to Pet Daily Care</h2>
                <p className="modal-text">
                    Let’s start by adding your furry friend’s profile <br />
                    so you can keep track of their health and habits!
                </p>
                <div className="modal-actions">
                    <button className="modal-btn cancel" onClick={onClose}>Later</button>
                    <button 
                        className="modal-btn welcome-add" 
                        onClick={() => { onClose(); navigate('/add-profile'); }}
                    >
                        Add Pet
                    </button>
                </div>
            </div>
        </div>
    );
};
export default WelcomePopup;