import './invite.css'

function Invite({src, alt, group, person, handleAccepted, handleDenied}) {
    return (
        <article className="invite">
            <img src={src} alt={alt} />
            <div className="invite__details">
                <h2>{group}</h2>
                <button onClick={handleAccepted}>Aceitar</button>
                <button onClick={handleDenied}>Negar</button>
                <p>Enviado por <span>{person}</span></p>
            </div>
        </article>
    )
}

export default Invite