import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { firestore, auth } from "@lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Footer from "@/components/footer";
import { signIn } from "@/lib/auth";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { Form } from "@/lib/types";
import FormSplash from "@/components/creation-tools/FormSplash";
import Link from "next/link";

function Admin() {
	const [user, userLoading, userError] = useAuthState(auth);
	const [data, setData] = useState([] as Form[]);

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
						<h1 className="col-span-5 col-start-3 text-4xl font-bold text-gray-900">
							My Forms
						</h1>
						<div className="col-span-5 col-start-3">
							{data.map((form, i) => (
								<FormSplash
									header={form.header}
									slug={"1"}
									key={i}
								/>
							))}
						</div>
						<Link
							href="/admin/new"
							className="hover:bg-accent hover:text-accent col-start-5 grid h-12 w-36 items-center rounded border-2 border-gray-900 text-center font-sans hover:font-bold"
						>
							New Form
						</Link>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}

export default Admin;
