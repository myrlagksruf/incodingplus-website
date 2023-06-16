'use client'

import { FC, ReactNode, createContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
type iModalState = {
    type:string;
    data:string[]|string;
};
interface iModalContext{
    modal:ReturnType<typeof useState<iModalState>>[0];
    setModal:ReturnType<typeof useState<iModalState>>[1];
}
export const ModalContext = createContext<iModalContext>({
    modal:{
        type:'',
        data:'',
    },
    setModal:() => {}
});

const Modal:FC<{title:string; types?:[string, string][];onSuccess:(data:string[]) => void;onAboart:() => void}> = ({title, types, onAboart, onSuccess}) => {
    let [inputs, setInputs] = useState<string[]>(Array(types?.length).fill(''));
    return <div className="bg-opacity-70 bg-black flex items-center justify-center" style={{
        width:'100vw', height:'calc(100 * var(--vh, 1vh))'
    }}>
        <div className="p-4 rounded-2xl bg-white flex flex-col">
            <h1 className="text-center text-2xl">{title}</h1>
            {!!types && types.map((v, i) => [
                <label
                    key={i * 2}
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor={`input-modal-${i}`}
                >
                    {v[0]}
                </label>,
                <input
                    id={`input-modal-${i}`}
                    key={i * 2 + 1}
                    type={v[1]}
                    value={inputs[i]}
                    className="shadow appearance-none border rounded w-full py-2 mb-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder={v[0]}
                    onChange={e => setInputs([...inputs.slice(0, i), e.currentTarget.value, ...inputs.slice(i + 1)])}
                />
            ])}
            <div className="flex justify-around w-full">
                <button onClick={() => onSuccess(inputs)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">확인</button>
                <button onClick={onAboart} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">취소</button>
            </div>
        </div>
    </div>
}

const Loading:FC = () => {
    return <div className="bg-opacity-70 bg-black flex items-center justify-center" style={{
        width:'100vw', height:'calc(100 * var(--vh, 1vh))'
    }}>
        <div className="w-16 h-16 loading" style={{
            backgroundImage:"url(/loading.svg)",
            backgroundSize:'contain',
            backgroundPosition:'center',
            backgroundRepeat:'no-repeat'
        }}></div>
    </div>
}

export const Container:FC<{children:ReactNode}> = ({children}) => {
    const [modal, setModal] = useState<iModalState>();
    const modalContainer = useRef<HTMLDivElement>();
    useEffect(() => {
        const modalTemp = document.querySelector<HTMLDivElement>('#modal-container');
        if(modalTemp){
            modalContainer.current = modalTemp;
        }
    }, []);
    return <div className="box-border control-section grid items-center" style={{
        gridTemplateColumns:'max-content 2fr max-content max-content 1fr max-content',
    }}>
        <ModalContext.Provider value={{
            modal, setModal
        }}>
            {modal?.type === 'loading' && createPortal(<Loading />, modalContainer.current as HTMLDivElement)}
            {modal?.type === 'folder-modal' && createPortal(
                <Modal
                    onSuccess={data => setModal({type:'folder-modal', data})}
                    onAboart={() => setModal({ type:'', data:''})}
                    title="새 폴더 만들기"
                    types={[['폴더명', 'text']]}
                />, modalContainer.current as HTMLDivElement)
            }
            {children}
        </ModalContext.Provider>
    </div>
}