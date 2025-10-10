import React from 'react';

const HintModal = ({ hint, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="hint-modal">
                <div className="modal-content">
                    <div className="hint-icon">
                        💡
                    </div>
                    
                    <h3 className="hint-title">
                        Pista Útil
                    </h3>
                    
                    <p className="hint-text">
                        {hint}
                    </p>
                    
                    <button 
                        className="btn btn-hint-close"
                        onClick={onClose}
                        style={{
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            border: '3px solid #b45309',
                            color: 'white',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '1rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        ✅ Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HintModal;