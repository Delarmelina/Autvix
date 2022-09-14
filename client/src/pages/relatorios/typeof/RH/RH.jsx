import React from 'react'

import "../../style.css"
import * as Icon from 'react-icons/fa'

import { GetCode, NewRowOnTable, GetTable } from '../../../../services/methods/SQLRequisit.js'
import { ModalButton } from '../../../../components/components/modalButton'
import { GenTable } from '../../../../components/components/genTable'
import { Container100 } from '../../../../components/components/container100'

export const RH = () => {

    // Variáveis de renderização
    const [Ativ, setAtivs] = React.useState([])             // Renderização em tela da variavel "atividades"
    const [RHs, setRHs] = React.useState([])                // Lista dos RHs preenchidos
    
    // Variáveis de lista com informações
    const [folgaPerm, setFolgaPerm] = React.useState([])    // Funcionário com permissão de autorizar folgas/desvios
    const [projetos, setProjetos] = React.useState([])      // Lista de projetos em andamento

    // Variáveis de funcionamento da lógica
    const [qtAtiv, setQtAtiv] = React.useState(false)       // Varialvel auxiliar que é alterada para a tabela recarregar
    const [atividades, setAtividades] = React.useState([])  // Armazena em object as atividades sendo preenchidas
    const [preench, setPreench] = React.useState({          // Função que armazena o preenchimento do novo RH
        matricula: "",
        email: "",
        data: "",
        trabalhou: 0,
        autorizacao: 0,
        id_ativ: 0,
        just: "",
        obs: ""
    })

    // Função que renderiza as opções e dados que necessitam ser renderizados apenas no primeiro momento
    // Tal como: "Preenchimento das opções disponiveis na seleção, obtenção da matricula do usuario logado"
    React.useEffect(() => {
        GetCode("select u.matricula, nome from perm_users p join Usuarios u on u.matricula = p.matricula where id_tipo = 'AUT'")
            .then(data => {
                setFolgaPerm(data.map(user => {

                    return (
                        <option key={user.matricula} value={user.matricula}>{user.nome}</option>
                    )
                }))
            })

        GetTable("projetos")
            .then(data => {
                setProjetos(data.map(projeto => {
                    return (
                        <option key={projeto.id_cc} value={projeto.id_cc}>{projeto.id_cc}</option>
                    )
                }))
            })

        let userLog = localStorage.getItem('9S94R10');
        GetCode(`select matricula, email from usuarios where matricula = ${userLog}`)
            .then((user) => {
                setPreench({ ...preench, email: user[0].email, matricula: user[0].matricula });
            })
    }, [])

    // Função que controla os campos do formulario de preenchimento para casa o funcionario tenha ou não trabalhado
    React.useEffect(() => {
        preench.trabalhou === '1' ? setPreench({ ...preench, autorizacao: 0, just: "" }) :
            preench.trabalhou === '2' ? setPreench({ ...preench, id_ativ: 0, just: "" }) :
                preench.trabalhou === '3' ? setPreench({ ...preench, id_ativ: 0, autorizacao: 0 }) :
                    console.log("");
    }, [preench.trabalhou])

    // Função que renderiza a tabela de RH preenchidos
    React.useEffect(() => {

        let SQLCode = "select u.email, p.data, trabalhou, obs, a.nome as aut, id_ativ from preench_rh p "
        SQLCode += "join usuarios u "
        SQLCode += "on u.matricula = p.matricula "
        SQLCode += "join usuarios a "
        SQLCode += "on p.autorizacao = a.matricula"

        GetCode(SQLCode)
            .then(data => {
                setRHs(data.map((RH, index) => {

                    let date = RH.data.slice(0, 10).split('-')

                    return (
                        <tr key={index}>
                            <td>{RH.email}</td>
                            <td>{date[2]}/{date[1]}/{date[0]}</td>
                            <td>{RH.trabalhou == 1 ? "Sim" : RH.trabalhou == 2 ? "Atestado" : "Folga"}</td>
                            <td>{RH.obs}</td>
                            <td>{RH.trabalhou === 3 ? RH.aut : ""}</td>
                            <td>{RH.id_ativ}</td>
                        </tr>
                    )
                }))
            })
    }, [])

    // Função que renderiza a tabela de atividades dentro do Modal de preencher novo relatório
    React.useEffect(() => {
        setAtivs(atividades.map((ativ, i) => {

            return (
                <tr className='listaAtividades' style={{ fontSize: '0.7em' }} key={i}>
                    <td style={{ minWidth: '125px' }}>
                        <select className='input-ativ' value={ativ.id_cc} onChange={e => {
                            let tempAtiv = atividades
                            tempAtiv[i].id_cc = e.target.value
                            setAtividades(tempAtiv)
                            setQtAtiv(!qtAtiv)
                        }}>
                            <option value={""} disabled>Projeto</option>
                            {projetos}
                        </select>
                    </td>
                    <td style={{ maxWidth: '50px' }}><input type="text" className="input-ativ" value={ativ.os} onChange={e => {
                        let tempAtiv = atividades
                        tempAtiv[i].os = e.target.value
                        setAtividades(tempAtiv)
                        setQtAtiv(!qtAtiv)
                    }} /></td>
                    <td><input type="text" className="input-ativ" value={ativ.tipo_aten} onChange={e => {
                        let tempAtiv = atividades
                        tempAtiv[i].tipo_aten = e.target.value
                        setAtividades(tempAtiv)
                        setQtAtiv(!qtAtiv)
                    }} /></td>
                    <td><input type="text" className="input-ativ" value={ativ.tipo_ativ} onChange={e => {
                        let tempAtiv = atividades
                        tempAtiv[i].tipo_ativ = e.target.value
                        setAtividades(tempAtiv)
                        setQtAtiv(!qtAtiv)
                    }} /></td>
                    <td><input type="time" className="input-ativ text-center" value={ativ.hora_inicio} onChange={e => {
                        let tempAtiv = atividades
                        tempAtiv[i].hora_inicio = e.target.value
                        setAtividades(tempAtiv)
                        setQtAtiv(!qtAtiv)
                    }} /></td>
                    <td><input type="time" className="input-ativ text-center" value={ativ.hora_final} onChange={e => {
                        let tempAtiv = atividades
                        tempAtiv[i].hora_final = e.target.value
                        setAtividades(tempAtiv)
                        setQtAtiv(!qtAtiv)
                    }} /></td>
                    <td style={{ minWidth: '300px' }}><textarea type="text" className="input-ativ" value={ativ.descricao} onChange={e => {
                        let tempAtiv = atividades
                        tempAtiv[i].descricao = e.target.value
                        setAtividades(tempAtiv)
                        setQtAtiv(!qtAtiv)
                    }} /></td>
                    <td style={{ maxWidth: '50px' }}><input type="text" className="input-ativ" value={ativ.desvio} onChange={e => {
                        let tempAtiv = atividades
                        tempAtiv[i].desvio = e.target.value
                        setAtividades(tempAtiv)
                        setQtAtiv(!qtAtiv)
                    }} /></td>

                    <td><button type="button" className='p-0 btn' onClick={() => removeAtividade(i)}><Icon.FaTrash style={{ color: 'red' }} /></button></td>
                </tr>
            )
        }))
    }, [qtAtiv])

    // Função usada para controlar o botão que insere nova atividade no RH
    function addNovaAtividade() {
        const newAtiv = atividades.concat({
            id_ativ: 0,
            id_cc: "",
            os: 0,
            tipo_aten: 0,
            tipo_ativ: 0,
            hora_inicio: "",
            hora_final: "",
            descricao: "",
            arq: "",
            desvio: 0,
            mot_desv: "",
            loc_desv: "",
            tmp_desv: "",
            aut_desv: ""
        })

        setAtividades(newAtiv)
        setQtAtiv(!qtAtiv)
    }

    // Função usada para remover atividade da lista do novo preenchimento de RH
    function removeAtividade(ativ) {
        const newAtiv = atividades
        newAtiv.splice(ativ, 1)
        setAtividades(newAtiv)
        setQtAtiv(!qtAtiv)
    }

    // Função que faz o envio dos dados de preenchimento de novo RH para o banco de dados
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
                <button type="button" className="btn btn-secondary mx-2" disabled>Resumo</button>
                <ModalButton ButtonColor='success' ModalName='PreenchRH' ButtonTitle='Responder' ModalTitle='Preencher Novo Relatório' func={SendDatatoDB} ConfirmTitle='Responder'>
                    <form>
                        <div className="input-group-sm mb-3 in-gp">
                            <label className="form-label" style={{ backgroundColor: "#ccc#", fontSize: "0.8em" }}>Email</label>
                            <input type="text" className="form-control" placeholder="Email" value={preench.email} onChange={e => { setPreench({ ...preench, email: e.target.value }) }} />
                        </div>
                        <div className="input-group-sm mb-3 in-gp">
                            <label className="form-label" style={{ backgroundColor: "#ccc#", fontSize: "0.8em" }}>Data de preenchimento</label>
                            <input type="date" className="form-control" placeholder="Data" value={preench.data} onChange={e => { setPreench({ ...preench, data: e.target.value }) }} />
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

                                    <Container100>
                                        <table className="text-center tabela-ativ">
                                            <thead style={{ fontSize: "0.8em", backgroundColor: "#777", color:"white" }}>
                                                <tr>
                                                    <th className='p-1'>Centro de Custo</th>
                                                    <th>OS</th>
                                                    <th>Atendimento</th>
                                                    <th>Atividade</th>
                                                    <th>Horário Inicio</th>
                                                    <th>Horário Término</th>
                                                    <th>Descrição</th>
                                                    <th>Desvio</th>
                                                    <th><Icon.FaTrash style={{ color: 'red' }} /></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Ativ}
                                            </tbody>
                                        </table>
                                        <button type="button" className="btn btn-secondary" onClick={addNovaAtividade}>Add Atividade</button>
                                    </Container100>

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
                            <input type="text" className="form-control" placeholder="Observações" value={preench.obs} onChange={e => { setPreench({ ...preench, obs: e.target.value }) }} />
                        </div>
                    </form>
                </ModalButton>
            </div>

            <Container100>
                <GenTable ColNumber='10' Color='light' HeaderColor='dark' ColumsName={['Email', 'Data', 'Trabalhou', 'Obs', 'Aut. Folga', 'Atividades']}>
                    {RHs}
                </GenTable>

                <div className="col-md-2 bg-danger">
                    <div className="row">
                        <h1>Filtros e opções</h1>
                    </div>
                </div>
            </Container100>
        </>
    )
}