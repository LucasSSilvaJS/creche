import './upload-image.css'
import { BiSolidPlusCircle } from 'react-icons/bi'

function UploadImage({handleFile, url}){
    return(
        <label className="upload-image" style={{backgroundImage: `url(${url})`}}>
            <input type="file" onChange={handleFile} accept="image/*"/>
            <BiSolidPlusCircle color="var(--quaternary__color)" size={100}/>
        </label>
    )
}

export default UploadImage