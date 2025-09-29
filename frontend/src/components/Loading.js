import React from 'react';

const Loading = ({ message = 'Cargando...', size = 'large' }) => {
    const spinnerSize = size === 'small' ? '20px' : size === 'medium' ? '30px' : '40px';

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
            gap: '1rem'
        }}>
            <div 
                className="spinner"
                style={{
                    width: spinnerSize,
                    height: spinnerSize,
                    border: `4px solid #f3f3f3`,
                    borderTop: `4px solid #007bff`,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}
            />
            <p style={{
                color: '#666',
                fontSize: '1.1rem',
                margin: 0,
                textAlign: 'center'
            }}>
                {message}
            </p>
        </div>
    );
};

export default Loading;