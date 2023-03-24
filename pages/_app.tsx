import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { AuthProvider } from "@/lib/newAuth";
import "styles/toast.css";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<AuthProvider>
			<Component {...pageProps} />
		</AuthProvider>
	);
}
