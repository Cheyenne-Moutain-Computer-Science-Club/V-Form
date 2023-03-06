import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { Form } from "@/lib/types";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";
import { getDocs, query, collection, where } from "firebase/firestore";
import Footer from "@/components/footer";
import { firestore } from "@/lib/firebase";
import FormSplash from "@/components/creation-tools/FormSplash";
import { signIn } from "@/lib/auth";

export default function Responses() {
	const [user, userLoading, userError] = useAuthState(auth);
	const [data, setData] = useState([] as Form[]);

	const router: any = useRouter();

	useEffect(() => {
		if (user) {
			getDocs(
				query(
					collection(firestore, "forms"),
					where("options.user", "==", user?.uid ?? "")
				)
			).then((querySnapshot) => {
				const data = querySnapshot.docs.map((doc) =>
					doc.data()
				) as Form[];
				setData(data);
			});
		}
	}, [user]);

	if (userLoading || !data) {
		return (
			<div className="flex h-screen flex-col justify-between">
				<main className="grid h-full items-center">
					<h1 className="text-center text-3xl font-bold text-gray-900">
						Loading...
					</h1>
				</main>
				<Footer />
			</div>
		);
	}

	if (!user && !userLoading) {
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

	return (
		<div className="flex h-screen flex-col justify-between">
			<main className="mb-auto">
				<div>
					<div className="mt-20 grid grid-cols-9 grid-rows-1">
						<div className="col-span-5 col-start-3 flex w-full justify-between">
							<Link
								href="/admin"
								className="font-xl group flex items-center rounded bg-neutral-50 px-2 font-bold text-gray-900 hover:bg-gray-900 hover:text-neutral-50"
							>
								<svg
									aria-hidden="true"
									fill="none"
									stroke="currentColor"
									strokeWidth={2}
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8"
								>
									<path
										d="M15.75 19.5L8.25 12l7.5-7.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								Back
							</Link>
							<h1 className="text-4xl font-bold text-gray-900">
								My Forms
							</h1>
						</div>
						<div className="col-span-5 col-start-3">
							{data.map((form, i) => (
								<FormSplash
									header={form.header}
									slug={form.slug}
									key={i}
								/>
							))}
							{data.length === 0 && (
								<h4 className="font-light text-gray-500">
									Make a new form with the plus button
								</h4>
							)}
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
