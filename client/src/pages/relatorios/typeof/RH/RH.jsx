import React from 'react'

import "../../style.css"

import { GetCode, NewRowOnTable } from '../../../../services/methods/SQLRequisit.js'

export const RH = () => {

    const [folgaPerm, setFolgaPerm] = React.useState([])
    const [preench, setPreench] = React.useState({
        matricula: "",
        email: "",
        data: "",
        trabalhou: 0,
        autorizacao: 0,
        id_ativ: 0,
        just: "",
        obs: ""
    })

    React.useEffect(() => {
        preench.trabalhou === '1' ? setPreench({ ...preench, autorizacao: 0, just: "" }) :
            preench.trabalhou === '2' ? setPreench({ ...preench, id_ativ: 0, just: "" }) :
                preench.trabalhou === '3' ? setPreench({ ...preench, id_ativ: 0, autorizacao: 0 }) :
                    setPreench({ ...preench })
    }, [preench.trabalhou])

    React.useEffect(() => {
        GetCode("select u.matricula, nome from perm_users p join Usuarios u on u.matricula = p.matricula where id_tipo = 'AUT'")
            .then(data => {
                setFolgaPerm(data.map(user => {

                    return (
                        <option key={user.matricula} value={user.matricula}>{user.nome}</option>
                    )
                }))
            })
    }, [])

    React.useEffect(() => {
        let userLog = localStorage.getItem('9S94R10');
        GetCode(`select matricula, email from usuarios where matricula = ${userLog}`)
            .then((user) => {
                setPreench({ ...preench, email: user[0].email, matricula:  user[0].matricula });
            })
    }, [])

    async function SendDatatoDB() {
        let UltAtiv = await GetCode('select MAX(id_ativ) as ativ from preench_rh')

        let preenchSend = preench
        delete preenchSend.email
        preenchSend.id_ativ = UltAtiv[0].ativ + 1

        await NewRowOnTable('preench_rh', preenchSend)
    }

    return (
        <>
            <div className="d-flex flex justify-content-end bg-dark p-1">
                <button type="button" className="btn btn-secondary mx-2" disabled>Meus RHs</button>
                <button type="button" className="btn btn-secondary mx-2" disabled>Todos RHs</button>
                <button type="button" className="btn btn-success mx-2" data-bs-toggle="modal" data-bs-target="#PreenchRHModal">Responder</button>
                <div className="modal fade" id="PreenchRHModal" tabIndex="-1" aria-labelledby="PreenchRHModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addColabModelLabel">Novo relatório de Hora</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="input-group-sm mb-3 in-gp">
                                        <label className="form-label" style={{ backgroundColor: "#ccc#", fontSize: "0.8em" }}>Email</label>
                                        <input type="text" className="form-control" placeholder="Email" value={preench.email} onChange={e => { setPreench({ ...preench, email: e.target.value }) }}/>
                                    </div>
                                    <div className="input-group-sm mb-3 in-gp">
                                        <label className="form-label" style={{ backgroundColor: "#ccc#", fontSize: "0.8em" }}>Data de preenchimento</label>
                                        <input type="date" className="form-control" placeholder="Data" value={preench.data} onChange={e => { setPreench({ ...preench, data: e.target.value }) }}/>
                                    </div>
                                    <label className="form-label" style={{ backgroundColor: "#ccc#", fontSize: "0.8em" }}>Trabalhou nesta data?</label>
                                    <select className="in-sel form-select" defaultValue="0" onChange={e => { setPreench({ ...preench, trabalhou: e.target.value }) }}>
                                        <option value="0" disabled>Trabalhou nesta data?</option>
                                        <option value="1">Sim</option>
                                        <option value="2">Atestado Médico</option>
                                        <option value="3">Folga</option>
                                    </select>
                                    {
                                        preench.trabalhou === "1" ?
                                            <div className="input-group-sm mb-3 in-gp">
                                                <label className="form-label" style={{ backgroundColor: "#ccc#", fontSize: "0.8em" }}>Atividades</label>
                                                <input type="text" className="form-control" placeholder="Atividades" value={preench.id_ativ} onChange={e => { setPreench({ ...preench, id_ativ: e.target.value }) }} />
                                            </div>
                                            : preench.trabalhou === "2" ?
                                                <div className="input-group-sm mb-3 in-gp">
                                                    <label className="form-label" style={{ backgroundColor: "#ccc#", fontSize: "0.8em" }}>Atestado Médico</label>
                                                    <input type="text" className="form-control" placeholder="Atestado" value={preench.just} onChange={e => { setPreench({ ...preench, just: e.target.value }) }} />
                                                </div>
                                                : preench.trabalhou === "3" ?
                                                    <select className="in-sel form-select" defaultValue="0" onChange={e => { setPreench({ ...preench, autorizacao: e.target.value }) }}>
                                                        <option value="0" disabled>Autorização da folga</option>
                                                        {folgaPerm}
                                                    </select>
                                                    : <></>
                                    }
                                    <div className="input-group-sm mb-3 in-gp">
                                        <label className="form-label" style={{ backgroundColor: "#ccc#", fontSize: "0.8em" }}>Observações</label>
                                        <input type="text" className="form-control" placeholder="Observações" value={preench.obs} onChange={e => { setPreench({ ...preench, obs: e.target.value }) }}/>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={SendDatatoDB}>Inserir</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid h-100">
                <div className="row h-100">
                    <div className="col-md-10 bg-success">
                        <div className="row">
                            <table className='table table-striped table-light table-hover text-center'>
                                <thead className='table-dark'>
                                    <tr>
                                        <th>Email</th>
                                        <th>Data</th>
                                        <th>Trabalhou</th>
                                        <th>Obs</th>
                                        <th>Aut. Folga</th>
                                        <th>Atividades</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Linhas da tabela
                                    {usuarios} */}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-md-2 bg-danger">
                        <div className="row">
                            <h1>Filtros e opções</h1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}