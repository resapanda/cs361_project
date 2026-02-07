import React from 'react';

const RecordDetailPopup = ({ isOpen, onClose, record, type }) => {
    if (!isOpen || !record) return null;

    const isDaily = type === 'daily_checkin';

    return (
        <div className="modal-overlay">
            <div className="modal-container detail-popup">
                <button className="close-x" onClick={onClose}>✕</button>

                <div className="detail-content">
                    {isDaily ? (
                        <>
                            {/* Food Section */}
                            <div className="detail-row">
                                <span className="detail-label">Food :</span>
                                <span className="detail-value">
                                    Morning <span className={`check-box ${record.food_morning ? 'checked' : ''}`}></span>
                                    Treat <span className={`check-box ${record.food_treat ? 'checked' : ''}`}></span>
                                    Night <span className={`check-box ${record.food_night ? 'checked' : ''}`}></span>
                                </span>
                            </div>

                            {/* Toilet Section */}
                            <div className="detail-row">
                                <span className="detail-label">Toilet :</span>
                                <span className="detail-value">
                                    Pee <span className={`check-box ${record.toilet_pee ? 'checked' : ''}`}></span>
                                    Poop <span className={`check-box ${record.toilet_poop ? 'checked' : ''}`}></span>
                                </span>
                            </div>

                            {/* Mood Section */}
                            <div className="detail-row">
                                <span className="detail-label">Mood :</span>
                                <span className={`mood-badge ${record.mood.toLowerCase()}`}>{record.mood}</span>
                            </div>

                            <div className="detail-row vertical">
                                <span className="detail-label">Symptoms :</span>
                                <div className="text-display-box">{record.symptoms || 'n/a'}</div>
                            </div>

                            <div className="detail-row vertical">
                                <span className="detail-label">Note :</span>
                                <div className="text-display-box min-height">{record.note || ''}</div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Vet Record Fields */}
                            <div className="detail-row">
                                <span className="detail-label">Clinic :</span>
                                <span className="detail-value">{record.clinic}</span>
                            </div>
                            <div className="detail-row vertical">
                                <span className="detail-label">Diagnosis :</span>
                                <div className="text-display-box">{record.diagnosis || 'n/a'}</div>
                            </div>
                            <div className="detail-row vertical">
                                <span className="detail-label">Note :</span>
                                <div className="text-display-box min-height">{record.note || ''}</div>
                            </div>
                        </>
                     )}
                </div>
            </div>
        </div>
    );
};

export default RecordDetailPopup;