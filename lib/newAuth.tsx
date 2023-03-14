import { createContext, useState, useEffect } from "react";
import firebase from "firebase/auth";
import nookies from "nookies";
import { app, auth } from "./firebase";

const AuthContext = createContext<{ user: firebase.User | null }>({
	user: null,
});

export function AuthProvider({ children }: any) {
	const [user, setUser] = useState<firebase.User | null>(null);

	useEffect(() => {
		return auth.onIdTokenChanged(async (user) => {
			if (!user) {
				setUser(null);
				nookies.set(undefined, "token", "", { path: "/" });
			} else {
				const token = await user.getIdToken();
				setUser(user);
				nookies.set(undefined, "token", token, { path: "/" });
			}
		});
	}, []);

	// force refresh the token every 10 minutes
	useEffect(() => {
		const handle = setInterval(async () => {
			const user = auth.currentUser;
			if (user) await user.getIdToken(true);
		}, 10 * 60 * 1000);

		// clean up setInterval
		return () => clearInterval(handle);
	}, []);

	return (
		<AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
	);
}
