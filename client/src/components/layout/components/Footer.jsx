import React from 'react'

import * as Icon from 'react-icons/fa'

export const Footer = () => {

    // HTML do menu lateral
    return (
        <footer className='nav navbar-dark bg-dark shadow-lg align-items-center' style={{ fontSize: '14px' }}>
            <div className='nav-item text-center text-secondary'>
                <Icon.FaCopyright />
                <span> Copyright 2022 - Todos os direitos reservados</span>
            </div>
        </footer>
    )
}