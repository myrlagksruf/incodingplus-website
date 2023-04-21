import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginContainer } from "../body";
export default async function Page() {
    let header = headers();
    let proto = header.get('x-forwarded-proto') ?? 'https'
    let host = header.get('host') ?? '';
    let csrf = '';
    let origin = `${proto}://${host}`;
    try {
        const res = await fetch(`${origin}/api/auth/csrf`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': header.get('cookie') ?? ''
            }
        });
        const json = (await res.json()) as { csrfToken:string };
        csrf = json.csrfToken
    } catch (err) {
        redirect('/login/error');
    }
    return (<LoginContainer>
        <h1 className="text-3xl w-max mb-5">이 페이지는 관리자 페이지입니다.</h1>
        <h2 className="text-xl text-center mb-5">관리자이시면 로그인을 해주세요.</h2>
        <form action="/api/auth/signin/google" method="POST">
            <input type="hidden" name="csrfToken" value={csrf} />
            <input type="hidden" name="callbackUrl" value={origin} />
            <button type="submit" className="flex button w-full items-center text-left bg-blue-500 rounded-md p-1">
                <Image className="box-content inline-block bg-white p-4 rounded-md" height={40} width={40} id="google-logo" alt="google-logo" src="/google.svg" />
                <span className="text-white flex-grow text-center p-4 text-2xl font-medium">구글로 로그인</span>
            </button>
        </form>
    </LoginContainer>)
}