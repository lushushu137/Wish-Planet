import React, { useEffect } from 'react';
import { appState } from "../utilities";
import "./PlanetCard.css"

function PlanetCard(props) {
    const {posX, posY, url, from, time, name} = props.planetInfo;
    
    return ( <div className='PlanetCard'>
        <div className="card-container" style={{"top": posY,"left": posX}}>
            <div className="card-container-pic">
                <img src={url} alt="planet pic"/>
                <h4>{name}'s Planet</h4>
            </div>
            <div className='card-container-text'>
                <p>FROM {from.toUpperCase()}</p>
                <p>{`(${time})`}</p>
            </div>
        </div>
    </div> );
}

export default PlanetCard;