import { ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import {theme} from "../styles"

import React, { useState } from 'react';
import { appState } from "../utilities";
import "./End.css"
import Fade from '@mui/material/Fade';
import GuideGif from '../asset/pic/guidegif.gif'

function End(props) {
    const [fadeIn, setFadeIn] = useState(true);

    return ( 
        <Fade in={true} timeout={1000}>
    
    <div className='End'>
       <h1>THANK YOU!</h1>
       <h3>PRODUCE</h3>
            <p>Lu Shu</p>
            <p>Ma Zhengtao</p>
            <p>Christy</p>
            <p>Gio</p>
            <p>William</p>
       <h3>SOUND ATTRIBUTIONS</h3>
        <p>u_chimes_short2.mp3 by BristolStories | License: Attribution Noncommercial 3.0</p>
        <p>Magic Sound.wav by Uzbazur | License: Attribution 3.0</p>
        <p>Remix of 19588__Freed__BEL_E01_Tone_magic_wand_#2.wav by Timbre | License: Attribution Noncommercial 4.0</p>
        <p>bell3.wav by creeeeak | License: Creative Commons 0</p>
        <p>Remix of 19588__Freed__BEL_E01_Tone_magic_wand_#2.wav by Timbre | License: Attribution Noncommercial 4.0</p>
        <p>Magic 3.Glitter+Arrival.wav by gsb1039 | License: Creative Commons 0</p>
        <p>Story Logo by DDmyzik | License: Attribution Noncommercial 3.0</p>
        <p>Amies - Discoveries: Looking Up To The Sky - Provided by Lofi Girl</p>
        <h3>INSPIRATION</h3>
        <p>
            <a href="https://editor.p5js.org/lukwest/sketches/ZkfwK2Voa" target="_blank">lukwest</a>&nbsp; 
            <a href="https://openprocessing.org/sketch/1370757" target="_blank">SamuelYAN</a>&nbsp; 
            <a href="https://openprocessing.org/sketch/1245454" target="_blank">Samuel Favreau</a></p>
    </div> 
    </Fade> 
    
    );
}

export default End;