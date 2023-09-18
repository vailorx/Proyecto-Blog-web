import {React} from 'react';
import {useState} from 'react';
import {useForm} from '../../hooks/useForm.jsx';
import {Peticion} from '../../helpers/Peticion.jsx';
import {Global} from '../../helpers/Global.jsx';

export const Crear = () => {
  const {formulario, enviado, cambiado} = useForm({});
  const [resultado, setResultado] = useState();
  const guardarArticulo = async(e) =>{
    e.preventDefault();

    //Recoger datos form
    let nuevoArticulo = formulario;
    console.log(nuevoArticulo);

    //Guardar articulo en backend
    const {datos} = await Peticion(Global.url + "crear", "POST", nuevoArticulo);

      //Subir Imagen
      const fileInput = document.querySelector("#file");
      if(datos.status === "success"){
        setResultado("guardado");
      }else{
      setResultado("error");
    }
 
    if(datos.status == "success" && fileInput.files[0]){
      setResultado("guardado");

      const formData = new FormData();
      formData.append("file0", fileInput.files[0]);

      const subida = await Peticion(Global.url + "subir-imagen/" + datos.article._id, "POST", formData, true);

      if(subida.datos.status === "success"){
        setResultado("guardado");
      }else{
      setResultado("error");
    }
  
  }
    
   
  }
  return (
    <div className='jumbo'>
      <h1>Crear artículo</h1>
      <p>Formulario para crear un artículo</p>
      <strong>{resultado == "guardado" ? "Articulo guardado con exito!" : ""}</strong>
      <strong>{resultado == "error" ? "Los datos proporcionados no son correctos" : ""}</strong>
      {/*montar formulario*/}
      <form className="formulario" onSubmit={guardarArticulo}>
        <div className='form-group'>
          <label htmlFor='titulo'>Título</label>
          <input type="text" name="titulo" onChange={cambiado}/>
        </div>
        <div className='form-group'>
          <label htmlFor='contenido'>Contenido</label>
          <textarea type="text" name="contenido" onChange={cambiado}/>
        </div>
        <div className='form-group'>
          <label htmlFor='file0'>Imagen</label>
          <input type="file" name="file0" id="file"/>
        </div>
        <input type="submit" value="Guardar" className='btn btn-success'/>
      </form>
    </div>
  )
}

