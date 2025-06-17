'use client'
import { Button } from "@/src/components/ui/button";
import { signIn } from "next-auth/react";

const LoginButton = () => {
    return <Button onClick={() => signIn()}>Sign in</Button>;
}

export default LoginButton;