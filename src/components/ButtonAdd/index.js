import { BiSolidPlusCircle } from "react-icons/bi";

import './button-add.css'

function ButtonAdd({handleCreate}){
    return(
        <div>
            <button className="button-add" onClick={handleCreate}>
                <BiSolidPlusCircle size={50} color="var(--quaternary__color)"/>
            </button>
        </div>
    )
}

export default ButtonAdd