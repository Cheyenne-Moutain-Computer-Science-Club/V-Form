import React from 'react'

function Toggle() {
  return (
    <div>
        <label className="relative inline-block w-[60px] h-[34px]">
            <input type="checkbox" className="w-0 h-0 opacity-0"/>
            <span className="absolute top-0 left-0 right-0 bottom-0 bg-neutral-300 duration-300"></span>
        </label>
    </div>
  )
}

export default Toggle