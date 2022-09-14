import React from 'react'

export const ModalButton = (props) => {

    return (
        <>
            <button type="button" className={`btn btn-${props.ButtonColor} mx-2`} data-bs-toggle="modal" data-bs-target={`#${props.ModalName}`}>{props.ButtonTitle}</button>
            <div className="modal fade" id={props.ModalName} tabIndex="-1" aria-labelledby={`${props.ModalName}Modal`} aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{props.ModalTitle}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body">
                            {props.children}
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={props.func}>{props.ConfirmTitle}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}