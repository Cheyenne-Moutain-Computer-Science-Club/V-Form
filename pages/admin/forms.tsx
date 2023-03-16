import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { firestore, auth } from "@lib/firebase";
import {
	collection,
	query,
	where,
	getDocs,
	doc,
	setDoc,
} from "firebase/firestore";
import Footer from "components/Footer";
import { Form } from "@/lib/types";
import FormSplash from "@/components/creation-tools/FormSplash";
import { NextRouter, useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import nookies from "nookies";
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import { admin } from "@lib/firebaseAdmin";

interface Poll {
	header: string;
	options: Object;
	questions: Array<Map<string, any>>;
	slug: string;
}

export default function AdminFormPage(
	props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
	const data = props.forms;

	const [user, userLoading, userError] = useAuthState(auth);
	const [newForm, setNewForm] = useState(false);

	const [nameInput, setNameInput] = React.useState<string>("");
	const router: NextRouter = useRouter();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNameInput(event.target.value);
	};

	const handleSubmit = async (event: React.SyntheticEvent) => {
		event.preventDefault();

		let formID = "";

		// TODO: Make this not an infinite loop with a break
		while (true) {
			// Generate ID
			formID = uuidv4().toString().substring(0, 8);

			// Pull known form names
			const q = query(
				collection(firestore, "forms"),
				where("name", "==", formID)
			);
			const querySnap = await getDocs(q);

			// If the form ID is taken, regenerate
			if (querySnap.empty) {
				break;
			}
		}

		// Create form
		const poll: Poll = {
			header: nameInput,
			slug: formID,
			options: {
				active: true,
				endDate: new Date(),
				submits: 1,
				whitelists: [],
				user: user?.uid,
			},
			questions: [],
		};

		const formRef = doc(firestore, "forms", formID);

		setDoc(formRef, poll).then(() => {
			// Redirect to edit page
			router.push(`/admin/edit/${formID}`);
		});
	};

	const handleShowNewForm = () => {
		setNewForm(!newForm);
	};

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
							<button onClick={() => handleShowNewForm()}>
								{newForm ? (
									<svg
										aria-hidden="true"
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
										className="h-10 w-10 rounded hover:bg-gray-900 hover:text-neutral-50"
									>
										<path
											d="M19.5 12h-15"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								) : (
									<svg
										aria-hidden="true"
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
										className="h-10 w-10 rounded hover:bg-gray-900 hover:text-neutral-50"
									>
										<path
											d="M12 4.5v15m7.5-7.5h-15"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								)}
							</button>
						</div>
						{newForm && (
							<div className="col-span-5 col-start-3 my-8 flex flex-col items-center rounded border-2 border-gray-900 p-4 text-gray-900">
								<div className="flex w-full justify-between">
									<input
										onChange={(event) =>
											handleChange(event)
										}
										type="text"
										placeholder="Form Name"
										className="h-12 w-96 rounded border-b-2 border-neutral-900 bg-neutral-200 p-2 text-gray-900 outline-none placeholder:italic placeholder:text-gray-400"
									/>
									<button
										className="h-12 w-28 rounded border-2 border-gray-900 hover:bg-gray-900 hover:text-neutral-50"
										onClick={(event) => handleSubmit(event)}
									>
										Create
									</button>
								</div>
							</div>
						)}
						<div className="col-span-5 col-start-3">
							{data.map((form, i) => (
								<FormSplash
									header={form.header}
									slug={form.slug}
									key={i}
								/>
							))}
							{data.length === 0 && !newForm && (
								<h4 className="mt-2 flex items-center justify-center font-light text-gray-500">
									<svg
										fill="none"
										stroke="currentColor"
										strokeWidth={1.5}
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
										aria-hidden="true"
										className="mx-1 inline-block h-5 w-5"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
										/>
									</svg>
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
				if (!snapshot.exists || data?.email !== email) {
					ctx.res.writeHead(302, {
						Location:
							"/admin/permissionDenied?slug=" + ctx.params?.slug,
					});
					ctx.res.end();
					throw Error(
						"User does not have permission to view this page"
					);
				}
				return data;
			});

		let forms = await admin
			.firestore()
			.collection("forms")
			.where("options.user", "==", uid)
			.get()
			.then((snapshot) => {
				let data: Form[] = snapshot.docs.map((doc) => {
					let data = doc.data();
					data.options.endDate = data.options.endDate
						.toDate()
						.toString();
					return data;
				}) as Form[];

				return data;
			});

		return {
			props: {
				forms: forms,
			},
		};
	} catch (err) {
		ctx.res.writeHead(302, { Location: "/login?slug=admin/forms" });
		ctx.res.end();

		return { props: {} as never };
	}
}
