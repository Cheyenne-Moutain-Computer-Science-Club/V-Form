import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { firestore, auth } from "@lib/firebase";
import {
	collection,
	query,
	where,
	getDocs,
	getFirestore,
	doc,
	setDoc,
} from "firebase/firestore";
import Footer from "@/components/footer";
import { signIn } from "@/lib/auth";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { Form } from "@/lib/types";
import FormSplash from "@/components/creation-tools/FormSplash";
import Link from "next/link";
import AdminMenu from "@/components/creation-tools/AdminMenu";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";

interface Poll {
	header: string;
	options: Object;
	questions: Array<Map<string, any>>;
	slug: string;
}

function Admin() {
	const [user, userLoading, userError] = useAuthState(auth);
	const [data, setData] = useState([] as Form[]);
	const [newForm, setNewForm] = useState(false);

	const [nameInput, setNameInput] = React.useState<string>("");
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

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNameInput(event.target.value);
	};

	const handleSubmit = async (event: React.SyntheticEvent) => {
		event.preventDefault();

		let formID: string = "";

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
				end: null,
				submits: 1,
			},
			questions: [],
		};

		const formRef = doc(firestore, "forms", formID);

		setDoc(formRef, poll).then(() => {
			// Redirect to edit page
			router.push(`/admin/edit/${formID}`);
			console.log(formID);
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
										className="h-12 w-96 rounded border-b-2 border-neutral-800 bg-neutral-200 p-2 text-gray-900 outline-none placeholder:italic placeholder:text-gray-400"
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

export default Admin;
