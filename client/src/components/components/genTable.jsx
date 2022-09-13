import React from 'react'

export const GenTable = (props) => {

    return (
        <div className={`col-md-${props.ColNumber}`}>
            <div className="row">
                <table className={`table table-striped table-${props.Color} table-hover text-center`}>
                    <thead className={`table-${props.HeaderColor}`}>
                        <tr>
                            {props.ColumsName.map((colName, i) => {
                                return <th key={i}>{colName}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody className='table-body'>
                        {props.children}
                    </tbody>
                </table>
            </div>
        </div>
    )
}