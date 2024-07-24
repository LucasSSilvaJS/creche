import './img-circle.css'

function ImgCircle({src, alt, marginTop, marginBottom}) {
    return <img className="img-circle" src={src} alt={alt} style={{marginTop, marginBottom}}/>
}

export default ImgCircle;