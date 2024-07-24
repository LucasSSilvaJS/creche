import './loading.css'

function Loading() {
    return (
        <div className="overlay">
            <div className="loader__fullscreen">
                <div className="loader-cube">
                    <div className="face"></div>
                    <div className="face"></div>
                    <div className="face"></div>
                    <div className="face"></div>
                    <div className="face"></div>
                    <div className="face"></div>
                </div>
            </div>
        </div>
    )
}

export default Loading