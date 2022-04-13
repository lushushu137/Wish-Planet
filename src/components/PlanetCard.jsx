import React, { useEffect } from 'react';
import { appState } from "../utilities";
import "./PlanetCard.css"


function PlanetCard(props) {
    useEffect(()=>{
        console.log(props)
    },[])
    return ( <div className='PlanetCard'>
        <div className="card-container" style={{"top": props.planetInfo.posY,"left": props.planetInfo.posX}}>
            <img src="" alt="planet pic" />
            <p>From {props.planetInfo.from}</p>
            <p>{`(${props.planetInfo.time})`}</p>
        </div>
    </div> );
}

export default PlanetCard;