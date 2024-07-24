import './titulo.css'

// adicionar um h1 em children
function Titulo({ children, marginTop, marginBottom}) {
    return (
        <div className="titulo" style={{marginTop, marginBottom}}>
            {children}
        </div>
    )
}

export default Titulo