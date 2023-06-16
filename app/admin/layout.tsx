import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { allow } from "../api/auth/[...nextauth]/route";
import { getOrigin } from "../module";
import { Container } from "./container";

interface iUser{
    user:{
        name:string;
        email:string;
        image:string;
    }
    expires:string;
    accessToken:string;
}

export default async function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    let origin = getOrigin();
    try {
        const res = await fetch(`${origin}/api/auth/session`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': headers().get('cookie') ?? ''
            }
        });
        const json = (await res.json()) as iUser;
        if(json.accessToken){
            allow.includes(json?.user?.email)
        } else {
            throw '잘못된 접근';
        }
    } catch (err) {
        redirect('/login/signin');
    }
    return <>
        <div id="modal-container" className="absolute left-0 top-0" style={{
            zIndex:9999
        }}></div>
        <Container>
            {children}
        </Container>
    </>
}