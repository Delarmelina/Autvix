import React from 'react'

import * as Icon from 'react-icons/fa'

export const PageNotFound = () => {

    // HTML do menu lateral
    return (
        <div className='d-flex bg-secondary text-warning align-items-center justify-content-center' style={{ fontSize: "25px", height: "100%" }}>
            <Icon.FaExclamationCircle className='mx-4 text-warning' />
            <span>Page not found !!!</span>
        </div>
    )
}