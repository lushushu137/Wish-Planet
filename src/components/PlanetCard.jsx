import React from 'react';
import { appState } from "../utilities";
import "./PlanetCard.css"


function PlanetCard(props) {

    return ( <div className='PlanetCard'>
        <div className="container">
            <img src="" alt="planet pic" />
            <p>From {props.from}</p>
            <p>{`(${props.time})`}</p>
        </div>
    </div> );
}

export default PlanetCard;