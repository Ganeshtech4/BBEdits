import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
console.log(process.env.GOOGLE_CLIENT_ID,'red');
export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ],
  secret: process.env.SECRET,
}

export default NextAuth(authOptions);