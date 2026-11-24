import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function AdminLogin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {

        event.preventDefault();

        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            setErrorMessage(error.message);
            return;
        }

        navigate("/admin");
    }

    return (
        <section className="flex min-h-[80vh] items-center justify-center px-4">

            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">

                <h1 className="mb-2 text-center text-3xl font-bold text-text">
                    Admin Login
                </h1>

                <p className="mb-8 text-center text-gray-500">
                    Sign in to manage Foring.
                </p>

                <form
                    onSubmit={handleLogin}
                    className="flex flex-col gap-5"
                >

                    <div>
                        <label className="mb-2 block font-semibold text-text">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-semibold text-text">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                            required
                        />
                    </div>

                    {errorMessage && (
                        <p className="text-sm text-red-500">
                            {errorMessage}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="rounded-lg bg-primary py-3 font-semibold text-white hover:bg-hover"
                    >
                        Login
                    </button>

                </form>

            </div>

        </section>
    );
}

export default AdminLogin;