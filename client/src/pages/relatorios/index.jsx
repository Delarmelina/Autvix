import React from 'react'
import { Routes, Route } from "react-router-dom";

import "./style.css"

import { Navegation } from "./navegation"
import { RH } from './typeof/RH/RH';
import { Torta } from './typeof/Torta/index';
import { RHDetails } from './typeof/RH/rhDetails'
import { PageNotFound } from '../../components/layout/components/PageNotFound';

export const Relatorios = () => {

  return (
    <Routes>
      <Route path="/" element={<Navegation />} />
      <Route path="/Torta" element={<Torta />} />
      <Route path="/RH" element={<RH />} />
      <Route path="/RH/:id_ativ" element={<RHDetails />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}