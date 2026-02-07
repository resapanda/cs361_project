import React, { useState } from 'react';
import DeletePopup from '../components/DeletePopup';

const DeleteForm = ({ rowObject, idColumnName, idKey, endpoint, backendURL, refresh, messageType, buttonType }) => {
    const [showPop, setShowPop] = useState(false);

    const handleDelete = async () => {
        const formData = { [idKey]: rowObject[idColumnName] };

        try {
            const response = await fetch(backendURL + endpoint, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();

            if (response.ok) {
                refresh();
            } else {
                alert(result.message || "Error deleting item.");
            }
        } catch (error) {
            console.error('Error during deletion:', error);
        } finally {
            setShowPop(false);
        }
    };

    return (
        <div>
            <button 
                className={buttonType === 'icon' ? 'delete-icon-btn' : 'action-btn delete'} 
                type="button" 
                onClick={() => setShowPop(true)}
            >
                {buttonType === 'icon' ? '✕' : 'Delete'}
            </button>

            <DeletePopup 
                isOpen={showPop} 
                onClose={() => setShowPop(false)} 
                onConfirm={handleDelete} 
                itemName={rowObject.name || "this record"} 
                messageType={messageType}
            />
        </div>
    );
};
export default DeleteForm;