import React from 'react'

import { GetCode, GetTable } from '../../services/methods/SQLRequisit.js'
import { NewUser } from '../../services/methods/usermethods.js'

import "./style.css"

export const Colaboradores = () => {

  const [usuarios, setUsuarios] = React.useState([])
  const [funcoes, setFuncoes] = React.useState([])
  const [depart, setDepart] = React.useState([])

  const [seldep, setSeldep] = React.useState("0")
  const [newUser, setNewUser] = React.useState({
    matricula: 0,
    nome: "",
    abrev: "",
    email: "",
    born: "",
    endereco: "",
    id_funcao: "",
    contratacao: "",
    password: "",
    confirmpassword: ""
  })

  React.useEffect(() => {

    async function update() {
      await GetCode('select MAX(matricula) as mat from usuarios')
        .then(res => {
          setNewUser({ ...newUser, matricula: res[0].mat + 1 })
        })
    }

    update()
  }, [])

  React.useEffect(() => {
    GetCode('select * from Usuarios u join Funcoes f on u.id_funcao = f.id_funcao join Departamentos d on f.id_dep = d.id_dep where u.matricula > 0')
      .then(data => {
        setUsuarios(data.map(user => {

          return (
            <tr key={user.matricula}>
              <td>{user.matricula}</td>
              <td>{user.nome}</td>
              <td>{user.email}</td>
              <td>{user.funcao}</td>
              <td>{user.departamento}</td>
            </tr>
          )
        }))
      })
  }, [])

  React.useEffect(() => {
    GetCode("select * from Funcoes f where f.id_dep = '" + seldep + "'")
      .then(data => {
        setFuncoes(data.map(funcao => {

          return (
            <option key={funcao.id_funcao} value={funcao.id_funcao}>{funcao.funcao}</option>
          )
        }))
      })
  }, [seldep])

  React.useEffect(() => {
    GetTable('Departamentos')
      .then(data => {
        setDepart(data.map(dep => {

          return (
            <option key={dep.id_dep} value={dep.id_dep}>{dep.departamento}</option>
          )
        }))
      })
  }, [])

  return (
    <div className=''>
      {/* Tabela de Usuarios */}
      <div className='bg-dark d-flex flex justify-content-end px-3'>
        <button type="button" className='btn btn-success mx-2' data-bs-toggle="modal" data-bs-target="#addColabModal">Add Colaborador</button>
        <div className="modal fade" id="addColabModal" tabIndex="-1" aria-labelledby="addColabModelLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addColabModelLabel">Adicionar novo Colaborador</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="input-group-sm mb-3 in-gp">
                    <input type="number" className="form-control" placeholder="Matricula" value={newUser.matricula} onChange={e => { setNewUser({ ...newUser, matricula: e.target.value }) }} />
                    <input type="text" className="form-control" placeholder="Nome Completo" value={newUser.nome} onChange={e => { setNewUser({ ...newUser, nome: e.target.value }) }} />
                    <input type="text" className="form-control" placeholder="Abreviatura" value={newUser.abrev} onChange={e => { setNewUser({ ...newUser, abrev: e.target.value }) }} />
                  </div>
                  <div className="input-group-sm mb-3 in-gp">
                    <input type="text" className="form-control" placeholder="Email" value={newUser.email} onChange={e => { setNewUser({ ...newUser, email: e.target.value }) }} />
                  </div>
                  <div className="input-group-sm mb-3 in-gp">
                    <label className="form-label" style={{ backgroundColor: "#ccc#", fontSize: "0.8em" }}>Data de Nascimento</label>
                    <input type="date" className="form-control" placeholder="Data de Nascimento" value={newUser.born} onChange={e => { setNewUser({ ...newUser, born: e.target.value }) }} />
                  </div>
                  <div className="input-group-sm mb-3 in-gp">
                    <input type="text" className="form-control" placeholder="Endereço" value={newUser.endereco} onChange={e => { setNewUser({ ...newUser, endereco: e.target.value }) }} />
                  </div>
                  <select className="in-sel form-select" defaultValue="" onChange={e => setSeldep(e.target.value)}>
                    <option value="" disabled>Departamento</option>
                    {depart}
                  </select>
                  <select className="in-sel form-select" defaultValue="" onChange={e => { setNewUser({ ...newUser, id_funcao: e.target.value }) }}>
                    <option value="" disabled>Cargo de Contratação</option>
                    {funcoes}
                  </select>
                  <div className="input-group-sm mb-3 in-gp">
                    <label className="form-label" style={{ backgroundColor: "#ccc#", fontSize: "0.8em" }}>Data de contratação</label>
                    <input type="date" className="form-control" placeholder="Contratação" value={newUser.contratacao} onChange={e => { setNewUser({ ...newUser, contratacao: e.target.value }) }} />
                  </div>
                  <div className="input-group-sm mb-3 in-gp">
                    <input type="password" className="form-control" placeholder="Senha" value={newUser.password} onChange={e => { setNewUser({ ...newUser, password: e.target.value }) }} />
                    <input type="password" className="form-control" placeholder="Confirme a senha" value={newUser.confirmpassword} onChange={e => { setNewUser({ ...newUser, confirmpassword: e.target.value }) }} />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => NewUser(newUser)}>Add</button>
              </div>
            </div>
          </div>
        </div>

        <button className='btn btn-secondary mx-2' disabled>Remover Colaborador</button>
        <button className='btn btn-secondary mx-2' disabled>Editar Colaborador</button>
      </div>
      <table className='table table-striped table-light table-hover text-center'>
        <thead className='table-dark'>
          <tr>
            <th>Matricula</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Função</th>
            <th>Departamento</th>
          </tr>
        </thead>
        <tbody>
          {/* Linhas da tabela */}
          {usuarios}
        </tbody>
      </table>
    </div>
  )
}