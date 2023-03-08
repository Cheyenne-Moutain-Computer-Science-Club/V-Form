import React from "react";

function StickyAlert() {
    return (
        <div>
            <div
                className={
                    "bg- relative mb-4 rounded border-0 px-6 py-4 text-white"
                }
            >
                <span className="mr-5 inline-block align-middle text-xl">
                    <i className="fas fa-bell" />
                </span>
                <span className="mr-8 inline-block align-middle">
                    <b className="capitalize">afds!</b> This is a adsf{" "}
                    alert - check it out!
                </span>
                <button
                    className="absolute right-0 top-0 mt-4 mr-6 bg-transparent text-2xl font-semibold leading-none outline-none focus:outline-none"
                >
                    <span>×</span>
                </button>
            </div>
        </div>
    );
}

export default StickyAlert;
