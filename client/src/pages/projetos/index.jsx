import React, { Component } from 'react'

import * as Icon from 'react-icons/fa'
import "./style.css"

import { GetTable } from '../../services/methods/SQLRequisit.js'

export const Projetos = () => {

  const [projetos, setProjetos] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    GetTable('projects').then(data => {
      setProjetos(data.map(projeto => {

        return (
          <tr key={projeto.name}>
            <td>{projeto.name}</td>
            <td>{projeto.client}</td>
            <td>{projeto.status}</td>
            <td>{projeto.begindata}</td>
          </tr>
        )
      }))
    })
  }, [])

  return (
    <div className=''>
      {/* Tabela de projetos */}
      <table className='table table-striped table-light table-hover text-center'>
        <thead className='table-dark border-top'>
          <tr>
            <th>Projeto</th>
            <th>Cliente</th>
            <th>Status</th>
            <th>Data de início</th>
          </tr>
        </thead>
        <tbody>
          {/* Linhas da tabela */}
          {projetos}
        </tbody>
      </table>
    </div>
  )
}