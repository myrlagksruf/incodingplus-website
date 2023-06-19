'use client'
import { FC, useRef, useState } from "react";
import { ReactMarkdownWrap } from "../utils/lib";
import { TabView, TabPanel } from 'primereact/tabview';
import './client.scss';
export const SosicList:FC<{list:string[]}> = ({list}) => {
    return (<TabView>
        {list.map((v, i) => <TabPanel key={i} header={v.split('.')[1]}>
            <ReactMarkdownWrap
                url={`root/sosic/${v}/index.md`}
                onload={() => {}}
            />
        </TabPanel>)}
    </TabView>)
}