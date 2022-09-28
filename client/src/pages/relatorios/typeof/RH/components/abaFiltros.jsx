import React from 'react'

import "../../../style.css"

export const AbaFiltros = (props) => {

    return (
        <div className="row">
            <h1 style={{ fontSize: "1.3em" }} className="p-2 bg-secondary text-white text-center">Filtros</h1>
            <div className='bg-secondary'>
                <label>Nome</label>
                <input type="text"></input>
            </div>
            <div className='bg-secondary'>
                <label>De</label>
                <input type="text"></input>
            </div>
            <div className='bg-secondary'>
                <label>Até</label>
                <input type="text"></input>
            </div>
            <div className='bg-secondary'>
                <label>Centro de Custo</label>
                <input type="text"></input>
            </div>
        </div>
    )
}