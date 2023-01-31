import Head from "next/head";
import Footer from "@/components/footer";
import { signOut } from "@lib/auth";

export default function Home() {
	return (
		<>
			<Head>
				<title>Create Next App</title>
				<meta
					name="description"
					content="Generated by create next app"
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<h1>Welcome to Next.js!</h1>
				<button onClick={() => signOut()}>SIGN OUT</button>
			</main>
			<Footer />
		</>
	);
}
