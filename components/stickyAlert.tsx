import React, { useEffect } from "react";

function StickyAlert({
    closehandler,
    title,
    text,
    color,
    show
}: {
    closehandler: () => void;
    title: string;
    text: string; 
    color: string;
    show: boolean;
}) {
    const [fade, setFade] = React.useState(false);
    useEffect(() => {
        if (show) {
            setFade(true);
        } else {
            setFade(false);
        }
        console.log(fade);
    }, [show]);

    return (
        <div className={`delay-[3000ms] transition-all duration-300 ${fade ? "opacity-0" : "opacity-100"}`}>
            <div
                className={"mx-7 fixed mb-4 rounded-md border-0 px-4 py-4 text-md text-white bottom-0 left-0 right-0 bg-" + color + "-500"}
            >
                <span className="mr-5 inline-block align-middle text-xl">
                    <i className="fas fa-bell" />
                </span>
                <span className="mr-8 inline-block align-middle">
                    <b className="capitalize">{title}</b> {text}
                </span>
                <button
                    className="absolute right-0 top-0 mt-4 mr-6 bg-transparent text-2xl font-semibold leading-none outline-none focus:outline-none"
                    onClick={closehandler}
                >
                    <span>×</span>
                </button>
            </div>
        </div>
    );
}

export default StickyAlert;
