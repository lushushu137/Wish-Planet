
import {theme} from "../styles"
import { ThemeProvider } from '@mui/material/styles';
import GenerateInP5 from './GenerateInP5';
import "./GeneratePlanet.css";
import React , { useEffect, useRef, useState }from "react";
import {generatingState, appState, sleep} from '../utilities'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';
import Fade from '@mui/material/Fade';
import {newStar, starName} from "../starData";

function GeneratePlanet(props) {
    const [state, setState] = useState(generatingState.BEFORE);
    const [p5Context, setP5Context] = useState(null);
    const [name, setName] = useState("");
    const [fadeIn, setFadeIn] = useState(true);
    const [imgFadeIn, setImgFadeIn] = useState(false);
    const from = starName[Math.floor(Math.random() * (starName.length - 1))];
    const handleState = (comingstate, p5, cnv) =>{
        setState(comingstate);
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
    const currentTime = CurentTime();

    const renderText = () => {
        switch (state) {
            case generatingState.BEFORE:
                return <>
                        <p>YOU CAUGHT A WISHING STAR FROM {from}</p>
                        <p>{currentTime}</p>
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
            //  case generatingState.SEND:
            //     return <></>
            default:
            break
        }
    }
    const handleDownload = () =>{
        p5Context.p5.saveCanvas(p5Context.cnv, 'myPlanet', 'jpg');
    }
    const handleSend = async() =>{
        setState(generatingState.SEND);
        let newStarData = newStar(currentTime, name, from, p5Context.cnv.canvas.toDataURL())
        props.saveStar(newStarData)

        // hide whole panel
        setFadeIn(false);
        setImgFadeIn(true);
        await sleep(3000)
        setImgFadeIn(false);
        await sleep(1000)
        props.toNextState(appState.GAMING)
    }
    const handleChange = (event) => {
        setName(event.target.value)
    }
    return ( 
        <>
            <Fade in={fadeIn} timeout={1000}>
                <div className='GeneratePlanet'>
                    <div className='generatePlanet-container'>
                    {renderText()}
                        <GenerateInP5 setGeneratingState={handleState}/>
                        {state == generatingState.END ? 
                        <div className='btnContainer'>
                            <ThemeProvider theme={theme}>
                            
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={'text'}
                                value={name}
                                color="primary"
                                onChange={handleChange}
                                placeholder="Your name"
                                endAdornment={
                                    <InputAdornment position="end">
                                            <IconButton onClick={handleSend} color="primary">
                                                <SendIcon
                                                    aria-label="toggle password visibility"
                                                    edge="end"
                                                >
                                                </SendIcon>
                                            </IconButton>
                                        </InputAdornment>
                                }
                                label="Password"
                            />
                                </ThemeProvider>

                            {/* <button className='btn' onClick={handleDownload}>DOWNLOAD</button>  */}
                        </div>
                        
                        : null
                    }
                    </div>
                </div> 
            </Fade> 
            {state == generatingState.SEND ? 
            <Fade in={imgFadeIn} timeout={1000}>

                <img src={p5Context.cnv.canvas.toDataURL()} style={{
                    'position':'absolute',
                    'top':'50%',
                    'left': '50%',
                    'width':400,
                    'height':400,
                    'border':'none',
                    'transform': 'translate(-50%, -50%)'
                }}/>
            </Fade>

            : null}

        </>
   
    );
}

export default GeneratePlanet;