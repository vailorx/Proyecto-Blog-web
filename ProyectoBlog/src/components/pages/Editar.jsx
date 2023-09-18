import {React} from 'react';
import {useState} from 'react';
import {useForm} from '../../hooks/useForm.jsx';
import {Peticion} from '../../helpers/Peticion.jsx';
import {Global} from '../../helpers/Global.jsx';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const Editar = () => {
  const {formulario, enviado, cambiado} = useForm({});
  const [resultado, setResultado] = useState();
  const [articulo, setArticulo] = useState({});
  const params = useParams();
  useEffect(() => {
    conseguirArticulo();
  }, []);
  const conseguirArticulo = async () => {
    const { datos } = await Peticion(
      Global.url + "articulo/" + params.id,
      "GET"
    );
      console.log(datos)
    if (datos.status === "success") {
      console.log(datos)
      setArticulo(datos.articulo);
    }
  };
  const editarArticulo = async(e) =>{
    e.preventDefault();

    //Recoger datos form
    let nuevoArticulo = formulario;

    //Guardar articulo en backend
    const {datos} = await Peticion(Global.url + "articulo/" + params.id, "PUT", nuevoArticulo);

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
      
      const subida = await Peticion(Global.url + "subir-imagen/" + datos.articulo._id, "POST", formData, true);

      if(subida.datos.status === "success"){
        setResultado("guardado");
      }else{
      setResultado("error");
    }
  
  }
    
   
  }
  return (
    <div className='jumbo'>
      <h1>Editar artículo</h1>
      <p>Formulario para editar el articulo: {articulo.titulo}</p>
      <strong>{resultado == "guardado" ? "Articulo guardado con exito!" : ""}</strong>
      <strong>{resultado == "error" ? "Los datos proporcionados no son correctos" : ""}</strong>
      {/*montar formulario*/}
      <form className="formulario" onSubmit={editarArticulo}>
        <div className='form-group'>
          <label htmlFor='titulo'>Título</label>
          <input type="text" name="titulo" onChange={cambiado} defaultValue={articulo.titulo}/>
        </div>
        <div className='form-group'>
          <label htmlFor='contenido'>Contenido</label>
          <textarea type="text" name="contenido" onChange={cambiado} defaultValue={articulo.contenido}/>
        </div>
        <div className='form-group'>
          <label htmlFor='file0'>Imagen</label>
          <div className="mascara">
        {articulo.imagen == "default.png" && (
          <img src="data:image/png;base64,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"></img>
        )}
        {articulo.imagen != "default.png" && (
          <img src={Global.url + "imagen/" + articulo.imagen}></img>
        )}
      </div>
          <input type="file" name="file0" id="file"/>
        </div>
        <input type="submit" value="Guardar" className='btn btn-success'/>
      </form>
    </div>
  )
}

