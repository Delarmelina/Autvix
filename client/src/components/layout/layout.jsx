import React from 'react'
import { Routes, Route } from "react-router-dom";

import "./style.css"

import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { MenuLateral } from './components/MenuLateral'
import { PageNotFound } from './components/PageNotFound';

import { Projetos } from '../../pages/projetos/index'
import { Colaboradores } from '../../pages/colaboradores/index'
import { Relatorios } from '../../pages/relatorios/index'

export const Layout = () => {

    // HTML do menu lateral
    return (
        <div className='Layout'>

            <Header />

            <main className=''>
                <Routes>
                    <Route path="/projetos" element={<Projetos />} />
                    <Route path="/colaboradores" element={<Colaboradores />} />
                    <Route path="/relatorios/*" element={<Relatorios />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </main>

            <MenuLateral />

            <Footer />
        </div>


    )
}