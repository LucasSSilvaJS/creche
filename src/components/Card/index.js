import { BiEdit, BiTrash } from 'react-icons/bi'
import './card.css'

function Card({title, subtitle, handleEditCard, handleDeleteCard, handleMenu}){
    function handleEditClick(e){
        e.stopPropagation()
        handleEditCard()
    }

    function handleDeleteClick(e){
        e.stopPropagation()
        handleDeleteCard()
    }

    return(
        <article className="card" onClick={handleMenu}>
            <div className="card__info">
                <h2 className="card__title">{title}</h2>
                <h3 className="card__subtitle">{subtitle}</h3>                
            </div>
            <div className="card__buttons">
                <button className="button__edit" onClick={handleEditClick}>
                    <BiEdit size={20} color="#F3EEEA"/>
                </button>
                <button className="button__delete" onClick={handleDeleteClick}>
                    <BiTrash size={20} color="#F3EEEA"/>
                </button>
            </div>
        </article>
    )
}

export default Card