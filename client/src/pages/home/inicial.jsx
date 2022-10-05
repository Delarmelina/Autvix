import React from 'react'

import "./style.css"

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'

export const Inicial = () => {

    const [value, onChange] = React.useState(new Date());

    const calendarStyle = () => {
        return {
            style: {
                backgroundColor: 'red', //this works
                color: 'green' //but why doesn't this work?
            }
        }
    }

    // HTML do menu lateral
    return (
        <div className='container-fluid bg-secondary h-100'>
            <h1 className='text-white text-center'>PAGINA INICIAL</h1>

            <Calendar onChange={onChange} value={value} className=""
                size={12}
                dayPropGetter={calendarStyle} />
        </div>


    )
}