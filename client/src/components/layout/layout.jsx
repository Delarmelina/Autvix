import React from 'react'
import { Routes, Route } from "react-router-dom";

import "./style.css"

import * as Icon from 'react-icons/fa'

import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { MenuLateral } from './components/MenuLateral'

import { Projetos } from '../../pages/projetos/index'

export const Layout = () => {

    // HTML do menu lateral
    return (
        <div className='Layout'>

            <Header />

            <main className=''>
                <Routes>
                    <Route path="/projetos" element={<Projetos />} />
                    <Route path="*" element={
                        <div className='d-flex bg-secondary text-warning align-items-center justify-content-center' style={{ fontSize: "25px", height: "100%" }}>
                            <Icon.FaExclamationCircle className='mx-4 text-warning'/>
                            <span>Page not found !!!</span>
                        </div>} />
                </Routes>
            </main>

            <MenuLateral />

            <Footer />
        </div>


    )
}