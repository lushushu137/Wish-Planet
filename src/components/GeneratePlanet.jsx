import DownloadIcon from '@mui/icons-material/Download';
import {theme} from "../styles"
import { ThemeProvider } from '@mui/material/styles';
import GenerateInP5 from './GenerateInP5';
import "./GeneratePlanet.css";
import React , { useEffect, useRef, useState }from "react";
import {generatingState, appState, sleep} from '../utilities'
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import SendIcon from '@mui/icons-material/Send';
import BlingBling from './BlingBlingP5';

import { IconButton } from '@mui/material';
import Fade from '@mui/material/Fade';
import {newStar, starName} from "../starData";



function GeneratePlanet(props) {
    const [state, setState] = useState(generatingState.BEFORE);
    const [p5Context, setP5Context] = useState(null);
    const [name, setName] = useState("");
    const [fadeIn, setFadeIn] = useState(true);
    const [imgFadeIn, setImgFadeIn] = useState(false);
    const [from, setFrom] = useState("");
    const handleState = (comingstate, p5, cnv) =>{
        setState(comingstate);
        setP5Context({p5, cnv})
    }

    useEffect(()=>{
        setFrom(starName[Math.floor(Math.random() * (starName.length - 1))])
    },[])


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

    const renderTopText = () => {
        switch (state) {
            case generatingState.BEFORE:
                return <>
                        <p>YOU CAUGHT A WISHING STAR FROM {from.toUpperCase()}</p>
                        <p>{currentTime}</p>
                    </>
            case generatingState.MIDDLE:
                return <>
                        <p>I'M LISTENING...</p>

                        <p></p>

                </>
            case generatingState.END:
                return <>
                 <p>A PLANET.. DEDICATED TO YOU!</p>
                        <p></p>
          </>
            default:
            break
        }
    }
    const renderBottomText = () => {
        switch (state) {
            case generatingState.BEFORE:
                return <>
                        <p>Tell me your wish</p>
                        <p>Your voice will light up the star</p>
                    </>
            case generatingState.MIDDLE:
                return <>
                        <p>click again to stop generating</p>

                </>
            case generatingState.END:
                return <>
                <ThemeProvider theme={theme}>
                    <InputBase
                     sx={{
                        width: 200,
                        color: '#fff',
                        padding: 1,
                        background: "rgba(255,255,255,0.2)",
                        borderRadius: 5,
                        '& .MuiSlider-thumb': {
                          borderRadius: '1px',
                        },
                        
                        '& .MuiInputBase-input':{
                            margin:1

                        }, '& .MuiInputBase-inputAdornedEnd':{

                        }, '& .css-yz9k0d-MuiInputBase-input':{
                            
                        }
                        // MuiInputBase-colorPrimary
                        // MuiInputBase-adornedEnd
                        // css-oyxmyn-MuiInputBase-root
                      }}
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
                    />
                    <IconButton onClick={handleDownload} color="primary">
                        <DownloadIcon
                            aria-label="toggle password visibility"
                            edge="end"
                        >
                        </DownloadIcon>
                    </IconButton>
                </ThemeProvider>
            </> 
            default:
            break
        }
    }





    const handleDownload = () =>{
        p5Context.p5.saveCanvas(p5Context.cnv, 'myPlanet', 'png');
    }

    const handleSend = async() =>{
        setState(generatingState.SEND);
        let newStarData = newStar(currentTime, name, from, p5Context.cnv.canvas.toDataURL())
        props.saveStar(newStarData)
        // hide whole panel
        setImgFadeIn(true);
        setFadeIn(false);
        await sleep(3000)
        setImgFadeIn(false);
        await sleep(1000);
        if (newStarData.end){
            props.toNextState(appState.END)

        } else {
            props.toNextState(appState.GAMING)
        }
    }
    const handleChange = (event) => {
        setName(event.target.value)
    }
    return ( 
        <>
                <div className='GeneratePlanet'>
            <Fade in={fadeIn} timeout={1000}>
                    <div className='generatePlanet-container'>
                    <div className="generatePlanet-top">{renderTopText()}</div>
                    <div className="generatePlanet-middle">
                        <GenerateInP5 setGeneratingState={handleState}/>
                        <BlingBling/>
                        {/* {state == generatingState.END && name.length > 0 ? 
                        <div className="generatePlanet-middle-name">{`${name}'s planet`}</div> :null
                        } */}
                        </div>
                    <div className="generatePlanet-bottom">{renderBottomText()}</div>
                    </div>
            </Fade> 
                </div> 
            {state === generatingState.SEND ? 
            <Fade in={imgFadeIn} timeout={500}>
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