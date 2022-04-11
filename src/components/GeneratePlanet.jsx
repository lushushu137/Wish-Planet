import GenerateInP5 from './GenerateInP5';
import "./GeneratePlanet.css";
import React , { useEffect, useRef, useState }from "react";
import {generatingState, appState} from '../utilities'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';

function GeneratePlanet(props) {
    const [state, setState] = useState(generatingState.BEFORE);
    const [p5Context, setP5Context] = useState(null);
    const [name, setName] = useState("");
    
    const handleState = (state, p5, cnv) =>{
        setState(state);
        setP5Context({p5, cnv})
    }
    const  CurentTime = () =>
    { 
        var now = new Date();
       
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
       
        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分
       
        var clock = year + ".";
       
        if(month < 10)
            clock += "0";
       
        clock += month + ".";
       
        if(day < 10)
            clock += "0";
           
        clock += day + " ";
       
        if(hh < 10)
            clock += "0";
           
        clock += hh + ":";
        if (mm < 10) clock += '0'; 
        clock += mm; 
        return(clock); 
    } 
    const renderText = () => {
        switch (state) {
            case generatingState.BEFORE:
                return <>
                        <p>YOU CAUGHT A WISHING STAR FROM PERSIEDS(PER)</p>
                        <p>{`(${CurentTime()})`}</p>
                    </>
            case generatingState.MIDDLE:
                return <>
                        <p>GENRATING...</p>
                        <p></p>

                </>
            case generatingState.END:
                return <>
                 <p>A planet.. dedicated to you!</p>
                        <p></p>
          </>
            default:
            break
        }
    }
    const handleDownload = () =>{
        p5Context.p5.saveCanvas(p5Context.cnv, 'myPlanet', 'jpg');
    }
    const handleSend = () =>{
        console.log(name);
        console.log(p5Context.cnv)
        console.log(p5Context.drawingContext)
        props.saveScreenShot(p5Context.cnv.canvas.toDataURL())
        props.toNextState(appState.GAMING)
    }
    const handleChange = (event) => {
        setName(event.target.value)
    }
    return ( 
    <div className='GeneratePlanet'>
        <div className='container'>
           {renderText()}
            <GenerateInP5 setGeneratingState={handleState}/>
            {state == generatingState.END ? 
            <div className='btnContainer'>
                
                <OutlinedInput
                    id="outlined-adornment-password"
                    type={'text'}
                    value={name}
                    onChange={handleChange}
                    placeholder="Give your planet a name"
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton>
                                <SendIcon
                                    aria-label="toggle password visibility"
                                    onClick={handleSend}
                                    edge="end"
                                >
                                </SendIcon>
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Password"
                />
                <button className='btn' onClick={handleDownload}>DOWNLOAD</button> 
            </div>
            
            : null
        }
        </div>
    </div> 
    );
}

export default GeneratePlanet;