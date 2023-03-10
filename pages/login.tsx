import Footer from "@components/footer";
import { signIn } from "@/lib/auth";
import { useRouter } from "next/router";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { GetServerSidePropsContext } from "next";
import { InferGetServerSidePropsType } from "next";
import LoadingPageState from "@/components/pageStates/Loading";

export default function LoginPageState(
	props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
	const router = useRouter();
	const [user, authLoading, authError] = useAuthState(auth);

	if (user) {
		if (props.slug) router.push("/form/" + props.slug);
		else router.push("/");
	}

	if (authLoading) return <LoadingPageState />;

	return (
		<div className="flex h-screen flex-col justify-between">
			<main className="grid h-full items-center">
				<h1 className="text-center text-3xl font-bold text-gray-900">
					Please{" "}
					<button
						className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent underline decoration-gray-900 decoration-dashed decoration-2 hover:decoration-wavy"
						onClick={() => signIn()}
					>
						Log In
					</button>{" "}
					to continue
				</h1>
			</main>
			<Footer />
		</div>
	);
}

export function getServerSideProps(context: GetServerSidePropsContext) {
	return {
		props: {
			slug: context.query.slug ?? null,
		},
	};
}
