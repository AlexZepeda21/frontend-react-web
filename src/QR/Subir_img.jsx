import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../url';
import { Button } from "react-bootstrap";
import imageCompression from "browser-image-compression";


const Subir_img = () => {

    const [id_producto, setid_producto] = useState("");
    const [route, setroute] = useState("");
    const [id_usuario, setid_usuario] = useState("");
    const [image, setImage] = useState(null);

    const [formData, setFormData] = useState({
        id_usuario: '',
        foto: '',
        imagenBase64: '',

    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id_productoparams = params.get('id_producto');
        const id_usuarioparams = params.get('id_usuario');
        const routeparams = params.get('route');

        if (id_productoparams) {
            setid_producto(id_productoparams);
            setroute(routeparams);
            setid_usuario(id_usuarioparams);
        }
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
         // alert(`Tamaño original (MB): ${(file.size / 1024 / 1024).toFixed(2)}`);
      
          try {
            const compressedFile = await imageCompression(file, {
              maxSizeMB: 1, // Reduce a 1 MB
              maxWidthOrHeight: 1024, // Limita la resolución
              useWebWorker: true, // Mejora el rendimiento
            });
      
            //alert(`Tamaño comprimido (MB): ${(compressedFile.size / 1024 / 1024).toFixed(2)}`);
      
            const reader = new FileReader();
            reader.onloadend = () => {
              setFormData((prevData) => ({
                ...prevData,
                imagenBase64: reader.result.split(",")[1],
              }));
              setImage(reader.result); 
             // alert("Imagen procesada correctamente.");
            };
            reader.readAsDataURL(compressedFile);
          } catch (error) {
            alert("Error al comprimir la imagen: " + error.message);
          }
        }
      };


    const handleSubmit = async (e) => {
        e.preventDefault();
        // alert(formData.foto)
        //alert(formData.id_usuario)
        try {
            const base64Image = formData.imagenBase64.replace(/^data:image\/\w+;base64,/, '');

            const response = await fetch(`${API_BASE_URL}/${route}/${id_producto}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    foto: base64Image,
                    id_usuario: id_usuario,
                }),
            });

      
            if (response.ok) {
                alert(`Imagen subida con éxito!`);
            } else {
                const errorMessage = await response.json(); // O .json() si es formato JSON

                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error);
        }
    };

    return (
        <div className="">
            <form onSubmit={handleSubmit} className="p-4 space-y-3">

                <label className="image-upload">
                    {image  ? (
                        <img
                            src={image}
                            alt="Previsualización de imagen"
                            className="upload-preview w-20 h-20 object-cover rounded"
                        />
                    ) : (
                        <span className="upload-placeholder text-center text-sm">Subir Imagen</span>
                    )}
                    <input
                        type="file"
                        className="file-input"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileChange}
                    />
                </label>

                <Button
                    type="submit"
                    className="bg-gradient-to-r from-pink-500 to-orange-500 text-white text-sm"
                >
                    Guardar Producto
                </Button>
            </form>
        </div>
    );
}

export default Subir_img