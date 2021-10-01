import './queroConhecer.scss';

export function QueroConhecer() {
    return (
        <div className="queroConhecer-content">
            <h1>Arizapp</h1>
            <iframe
                //width="269"
                //height="580"
                height="98%"
                width="auto"
                frameBorder="0"
                src="https://www.youtube.com/embed/6m_ZwZkU0jQ?autoplay=1&start=19&controls=0&hl=pt&iv_load_policy=3&loop=1&modestbranding=1&showinfo=0&rel=0&enablejsapi=1"
                title="Arizapp Demonstração."
                allow="accelerometer; autoplay; controls; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen></iframe>
        </div>
    );
}