import React, { useEffect } from 'react';
import { appState } from "../utilities";
import "./PlanetCard.css"

function PlanetCard(props) {
    const {posX, posY, url, from, time, name} = props.planetInfo;
    console.log('render card')
    
    return ( <div className='PlanetCard'>
        <div className="card-container" style={{"top": posY,"left": posX}}>
            <img src={url} alt="planet pic" style={{"width": 200, "height":200}}/>
            <p>From {from}</p>
            <p>{name}'s Planet</p>
            <p>{`(${time})`}</p>
        </div>
    </div> );
}

export default PlanetCard;