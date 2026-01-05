import { useState , useEffect} from 'react';

export default function Kosar( {accestoken} ){

    return(
        <div style={{marginTop:"100px"}}>

            <div>
                <h1>Kosár tartalma: </h1>
                <div>
                    <h4>Termék cím</h4>
                    <span>Termék író</span>
                    <img></img>
                </div>
            </div>

        </div>
    )

}