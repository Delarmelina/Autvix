import React from 'react'

export const NavCard = (props) => {

    // HTML do menu lateral
    return (
        <li className={`card mx-3 mt-3 bg-${props.color}`} >
            <a href={props.link} className="card-body">
                {props.name}
            </a>
        </li>
    )
}