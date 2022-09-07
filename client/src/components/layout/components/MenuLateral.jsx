import React from 'react'

import Logo from '../../../assets/logo.png'
import * as Icon from 'react-icons/fa'

export const MenuLateral = () => {

    // Lista de todas as abas existentes
    const abas = [
        { id: 1, nome: 'I', link: '/', icon: <Icon.FaHome /> },
        { id: 2, nome: 'R', link: '/relatorios', icon: <Icon.FaFileAlt /> },
        { id: 3, nome: 'Co', link: '/colaboradores', icon: <Icon.FaPersonBooth /> },
        { id: 4, nome: 'P', link: '/projetos', icon: <Icon.FaProjectDiagram /> },
        { id: 5, nome: 'C', link: '/calendario', icon: <Icon.FaCalendarAlt /> },
    ]

    // Retorna pagina aberta no momento
    const getActive = (link) => {
        if (window.location.pathname === link) {
            return 'active'
        }
    }

    // HTML do menu lateral
    return (
        <aside className='nav navbar-dark bg-dark shadow-lg' style={{ width: '70px' }}>
            <div className='flex-column '>
                <div className='nav-item text-center'>
                    <a className='nav-link text-info me-0 w-100' href='/'><img src={Logo} alt="logo" className="w-100 px-2 my-2" /> </a>
                </div>

                <ul className='navbar-nav'>
                    {abas.map(aba => (
                        <li key={aba.id} className={`nav-item mx-1 text-center ${getActive(aba.link) === 'active' ? "bg-info rounded-3" : null}`}>
                            <a className={`nav-link ${getActive(aba.link) === 'active' ? "active text-black" : null}`} href={aba.link}>
                                {aba.icon}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    )
}