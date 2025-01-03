import React from "react";
import QRCode from 'react-qr-code'


const Generador_de_codigo = (info) =>{

  //alert(info.id_producto)
  //alert(info.id_usuario)
  //alert(info.route)
    


    return(
        <div className="">
          <QRCode value={`http://192.168.0.13:3000/QR?id_producto=${info.id_producto}&id_usuario=${info.id_usuario}&route=${info.route}`}/>

        </div>
    );  
}

export default Generador_de_codigo