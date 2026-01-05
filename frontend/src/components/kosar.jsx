import { useState , useEffect} from 'react';
import { FaTrashCan } from "react-icons/fa6";
import "./kosar.css"


export default function Kosar( {accestoken} ){

    const gettermek = JSON.parse(localStorage.getItem("termek"))

    return(
        <>
        <h1 className='cim'>Kosár tartalma: </h1>
        
        <div className='kosarfodiv'>
            
                
                <div className='termekek'>
                    
                    <img src='/kepek/2399977867906.jpg'></img>
                    <div className='Termekinfo'>
                        <h4>{gettermek.cim}</h4>
                        <span>{gettermek.szerzok}</span><br></br>
                        <span>{gettermek.ar}</span><br></br>
                        <span>{gettermek.kiado_nev}</span><br></br>
                    </div>
                    
                    <input type="number" id='quantity' defaultValue={1}></input>
                    <FaTrashCan  style={{marginBottom:"auto",marginTop:"auto", marginLeft:"10%"}}/>
                </div>
                <div className='teljesar'>
                    <h4 id='rendelescim'>Rendelésed:</h4> 
                    <div className='Termekinfo'>
                        <span className='rendeles'>{} db termék</span>
                        <span className='rendeles'>Teljes ár: {} Ft</span>
                    </div>
                </div>


        </div>
        </>
    )

}