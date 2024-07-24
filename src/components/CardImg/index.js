import { BiEdit, BiAddToQueue, BiTrash } from 'react-icons/bi'
import './card-img.css'

function CardImg({children, urlImg, handleEdit, handleDelete, addLostItem, handleNavigate}){

    function clickLost(e){
        e.stopPropagation()
        return addLostItem()
    }

    function clickEdit(e){
        e.stopPropagation()
        return handleEdit()
    }

    function clickDelete(e){
        e.stopPropagation()
        return handleDelete()
    }

    return(
        <article className="card-img" onClick={handleNavigate}>
            <img src={urlImg} alt="foto de perfil" />
            <div className="card-img__content">
                {children}
            </div>
            <div className='card-img__buttons'>
                {addLostItem && (
                    <button className="button__lost" onClick={clickLost}>
                        <BiAddToQueue size={20} color="#F3EEEA"/>
                    </button>
                )}
                <button className="button__edit" onClick={clickEdit}>
                    <BiEdit size={20} color="#F3EEEA"/>
                </button>
                <button className="button__remove" onClick={clickDelete}>
                    <BiTrash size={20} color="#F3EEEA"/>
                </button>
            </div>
        </article>
    )
}

export default CardImg