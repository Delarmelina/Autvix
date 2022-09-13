import React from 'react'

export const Container100 = (props) => {

    return (
        <div className="container-fluid h-100">
            <div className="row h-100">
                {props.children}
            </div>
        </div>
    )
}