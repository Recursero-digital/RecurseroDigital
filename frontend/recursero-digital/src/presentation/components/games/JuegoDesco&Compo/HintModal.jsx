import React from 'react';

const HintModal = ({ hint, onClose }) => (
    <div className="modal-overlay">
        <div className="modal-content slide-in" data-aos="zoom-in">
            <div style={{
                fontSize: '3rem',
                textAlign: 'center',
                marginBottom: '1rem'
            }}>
                💡
            </div>
            
            <h3 style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '1rem',
                color: '#92400e',
                fontFamily: 'Playfair Display, serif'
            }}>
                ¡Aquí tienes una pista!
            </h3>
            
            <div className="hint-box">
                <p className="hint-text" style={{
                    fontSize: '1.1rem',
                    textAlign: 'center',
                    lineHeight: '1.6',
                    margin: 0
                }}>
                    {hint}
                </p>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button 
                    onClick={onClose} 
                    className="btn btn-hint"
                    style={{
                        padding: '0.75rem 2rem',
                        fontSize: '1.1rem'
                    }}
                >
                    ✨ ¡Entendido!
                </button>
            </div>
        </div>
    </div>
);

export default HintModal;