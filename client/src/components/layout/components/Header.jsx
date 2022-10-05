import React from 'react'

import * as Icon from 'react-icons/fa'

export const Header = () => {

    // Function that Get URL from browser
    const getPages = () => {
        const PageOpen = window.location.pathname
        const PagesSplit = PageOpen.split('/')

        const PagesFilter = PagesSplit.filter(page => page !== '')

        const PagesToUpperCase = PagesFilter.map(page => {
            return page.charAt(0).toUpperCase() + page.slice(1)
        })

        if (PagesToUpperCase.length === 0) {
            PagesToUpperCase[0] = 'Autvix Engenharia'
        }

        return <span className='text-info' style={{ fontSize: "16px", fontWeight: "bold" }}>{PagesToUpperCase.join(' > ')}</span>
    }

    // HTML do menu lateral
    return (
        <header className='nav navbar-dark bg-dark shadow-lg justify-content-between px-3'>

            {/* Create Description of the open pages */}
            <div className='d-flex align-items-center'>
                <div className='d-flex align-items-center'>
                    {getPages()}
                </div>
            </div>
            {/* Create user bottom on end menu */}
            <div className='nav-item text-center' style={{ cursor: "pointer" }}>
                <Icon.FaRegBell className='text-secondary mx-2' size={30} />
                <Icon.FaUserCircle className='text-secondary mx-2' size={30}/>
                <Icon.FaPowerOff className='text-secondary mx-2' size={30} onClick={() => localStorage.setItem("token", "")}/>
                <Icon.FaTh className='text-secondary mx-2 hovercolor' size={30} />
            </div>
        </header>
    )
}