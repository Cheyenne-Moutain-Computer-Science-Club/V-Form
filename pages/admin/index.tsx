import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { firestore, auth } from "@lib/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Footer from "components/Footer";
import { signIn } from "@/lib/auth";
import { Form } from "@/lib/types";
import FormSplash from "@/components/creation-tools/FormSplash";
import Link from "next/link";
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import { admin } from "@lib/firebaseAdmin";
import nookies from "nookies";

export default function Admin(
	props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
	const [user, userLoading, userError] = useAuthState(auth);
	const [forms, setForms] = useState([] as Form[]);

	useEffect(() => {
		if (user) {
			getDocs(
				query(
					collection(firestore, "forms"),
					where("options.user", "==", user?.uid ?? ""),
					orderBy("options.endDate", "desc")
				)
			).then((querySnapshot) => {
				const data = querySnapshot.docs.map((doc) =>
					doc.data()
				) as Form[];
				setForms(data);
			});
		}
	}, [user]);

	if (userLoading || !forms) {
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
							Hello PERSON
						</h1>
						<div className="col-span-5 col-start-3 my-12 grid grid-cols-4 grid-rows-1 rounded border-2 border-gray-900">
							<Link
								className="group col-start-1 flex h-32 flex-col items-center border-r-2 border-gray-900 p-8 hover:bg-gray-900"
								href="/admin/forms"
							>
								<h1 className="text-2xl font-bold text-gray-900 group-hover:text-neutral-50">
									My Forms
								</h1>
								<svg
									aria-hidden="true"
									fill="none"
									stroke="currentColor"
									strokeWidth={2}
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
									className="h-10 w-10 text-gray-900 group-hover:text-neutral-50"
								>
									<path
										d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</Link>
							<Link
								className="group col-start-2 flex h-32 flex-col items-center border-r-2 border-gray-900 p-8 hover:bg-gray-900"
								href="/admin/responses"
							>
								<h1 className="text-2xl font-bold text-gray-900 group-hover:text-neutral-50">
									Responses
								</h1>
								<svg
									aria-hidden="true"
									fill="none"
									stroke="currentColor"
									strokeWidth={2}
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
									className="h-10 w-10 text-gray-900 group-hover:text-neutral-50"
								>
									<path
										d="M7.875 14.25l1.214 1.942a2.25 2.25 0 001.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 011.872 1.002l.164.246a2.25 2.25 0 001.872 1.002h2.092a2.25 2.25 0 001.872-1.002l.164-.246A2.25 2.25 0 0116.954 9h4.636M2.41 9a2.25 2.25 0 00-.16.832V12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 01.382-.632l3.285-3.832a2.25 2.25 0 011.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0021.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 002.25 2.25z"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</Link>
							<Link
								className="group col-start-3 flex h-32 flex-col items-center border-r-2 border-gray-900 p-8 hover:bg-gray-900"
								href="/admin/whitelists"
							>
								<h1 className="text-2xl font-bold text-gray-900 group-hover:text-neutral-50">
									Whitelists
								</h1>
								<svg
									aria-hidden="true"
									fill="none"
									stroke="currentColor"
									strokeWidth={2}
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
									className="h-10 w-10 text-gray-900 group-hover:text-neutral-50"
								>
									<path
										d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</Link>
							<Link
								className="group col-start-4 flex h-32 flex-col items-center border-gray-900 p-8 hover:bg-gray-900"
								href="/admin/forms"
							>
								<h1 className="text-2xl font-bold text-gray-900 group-hover:text-neutral-50">
									Admin Access
								</h1>
								<svg
									aria-hidden="true"
									fill="none"
									stroke="currentColor"
									strokeWidth={2}
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
									className="h-10 w-10 text-gray-900 group-hover:text-neutral-50"
								>
									<path
										d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</Link>
						</div>
						<h1 className="col-span-5 col-start-3 text-4xl font-bold text-gray-900">
							Recent Forms
						</h1>
						<div className="col-span-5 col-start-3">
							{forms.map((form, i) => (
								<FormSplash
									header={form.header}
									slug={"1"}
									key={i}
								/>
							))}
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	try {
		const cookies = nookies.get(ctx);
		const token = await admin.auth().verifyIdToken(cookies.token);

		// the user is authenticated!
		const { uid, email } = token;

		let user = await admin
			.firestore()
			.collection("users")
			.doc(uid)
			.get()
			.then((snapshot) => {
				let data = snapshot.data();
				if (snapshot.exists || data?.email !== email) {
					ctx.res.writeHead(302, {
						Location:
							"/admin/permissionDenied?slug=" + ctx.params?.slug,
					});
					ctx.res.end();
					throw Error(
						"User does not have permission to view this page"
					);
				}
			});

		return {
			props: {},
		};
	} catch (err) {
		ctx.res.writeHead(302, { Location: "/login?slug=admin" });
		ctx.res.end();

		return { props: {} as never };
	}
}
