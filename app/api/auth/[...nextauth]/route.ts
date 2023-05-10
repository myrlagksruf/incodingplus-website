import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const allow = (process.env.ALLOW ?? '').split(';');

export const authOptions:AuthOptions = {
    providers:[
        GoogleProvider({
            clientId:process.env.CLIENT_ID ?? '',
            clientSecret:process.env.CLIENT_PW ?? '',
        })
    ],
    secret:process.env.SECRET,
    pages:{
      signIn:'/login/signin',
      error:'/login/error'  
    },
    callbacks:{
        async redirect({baseUrl, url}){
            return `${baseUrl}/admin`
        },
        async jwt({account, token, user, profile, session, trigger}){
            if(account){
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token, user }) {
            return {
                ...session,
                accessToken:token.accessToken as string
            }
        },
        async signIn({account, user, credentials, email, profile}){
            // console.log(account, user, credentials, email, profile);
            return allow.includes(profile?.email ?? '');
        }
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };