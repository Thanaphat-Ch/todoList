import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";


export function useLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn("credentials", { email, password, redirect: false });
        if (res?.error) setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        else router.push("/dashboard");
    };

    return {handleSubmit, setEmail, setPassword, error}
}