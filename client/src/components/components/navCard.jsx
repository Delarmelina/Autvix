import React from 'react'

import * as Icon from 'react-icons/fa'

export const NavCard = (props) => {

    // HTML do menu lateral
    return (
        <li className="card mx-3 mt-3 bg-info">
            <a href={props.link} className="card-body">
                {props.name}
            </a>
        </li>
    )
}