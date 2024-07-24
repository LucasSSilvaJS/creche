import './button-full.css'

function ButtonFull({texto, marginTop, marginBottom, handleAction}){
    return(
        <div className="button-full" style={{marginTop, marginBottom}} onClick={handleAction}>
            <button>{texto}</button>
        </div>
    )
}

export default ButtonFull

