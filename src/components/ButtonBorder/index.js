import './button-border.css'

function ButtonBorder({texto, marginTop, marginBottom, handleNavigate}){
    return(
        <div className="button-border" style={{marginTop, marginBottom}}>
            <button onClick={handleNavigate}>
                {texto}
            </button>
        </div>
    )
}

export default ButtonBorder

