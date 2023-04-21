import { FC } from "react"

export const LoginContainer:FC<{children:React.ReactNode}> = ({children}) => {
    return (<main className="flex flex-grow justify-center items-center">
    <div className="w-max rounded-lg bg-gray-100 p-5 box-border">
        {children}
    </div>
</main>)
}