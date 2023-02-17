import React from 'react'

function Checkbox({label}: {label: string}) {
  return (
    <div>
        <input type="checkbox" className="appearance-none cursor-pointer w-10 h-10 bg-gray-300 checked:bg-green-400 border border-gray-500 checked:border-green-400 rounded-lg"/>
        <label className="align-middle">fd</label>
    </div>
  )
}

export default Checkbox