'use client'

import { useState } from "react"


export default function Page(){
    let [val, setVal] = useState('')
    return (<>
        <input
            type="text"
            value={val}
            onChange={(e) => setVal(e.currentTarget.value)}
        />
        {val}
    </>)
}