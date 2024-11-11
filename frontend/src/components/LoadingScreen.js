import React from 'react';

export default function LoadingScreen() {
    return (
        <div style={styles.container}>
            <div style={styles.spinner}></div>
            <h2 style={styles.text}>Loading...</h2>
        </div>
    );
}

const styles = {
    container: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #FF385C',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    text: {
        marginTop: '1rem',
        fontSize: '1.5rem',
        color: '#FF385C',
    }
};

const stylesGlobal = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}`;

document.head.insertAdjacentHTML("beforeend", `<style>${stylesGlobal}</style>`);
