import { headers } from "next/headers";
export const svgToURL = (str:string) => `data:image/svg+xml;utf8,${encodeURIComponent(str)}`;
export const getOrigin = () => {
    let header = headers();
    let proto = header.get('x-forwarded-proto') ?? 'https'
    let host = header.get('host') ?? '';
    return `${proto}://${host}`;
}