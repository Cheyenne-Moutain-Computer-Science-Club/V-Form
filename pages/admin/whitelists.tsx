import { useEffect, useState, ChangeEvent } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { firestore, auth } from "@lib/firebase";
import {
	collection,
	getDocs,
	query,
	where,
	DocumentData,
	addDoc,
	getDocsFromServer,
} from "firebase/firestore";
import { QuerySnapshot } from "firebase/firestore";
import Footer from "@/components/footer";
import { signIn } from "@/lib/auth";
import WhitelistSplash from "@/components/creation-tools/WhitelistSplash";
import Link from "next/link";

export default function Whitelists() {
	const [user, userLoading, userError] = useAuthState(auth);
	const [newWhitelist, setNewWhitelist] = useState(false);
	const [newWhitelistName, setNewWhitelistName] = useState("");
	const [newWhitelistItems, setNewWhitelistItems] = useState([""]);
	const [newWhitelistLoading, setNewWhitelistLoading] = useState(false);
	const [newWhitelistPlaceholder, setNewWhitelistPlaceholder] =
		useState("Whitelist Name");
	const [dataSnapshot, setDataSnapshot] = useState<
		QuerySnapshot<DocumentData> | undefined
	>(undefined);

	useEffect(() => {
		if (user) {
			getDocs(
				query(
					collection(firestore, "whitelists"),
					where("user", "==", user.uid)
				)
			).then((querySnapshot) => {
				setDataSnapshot(querySnapshot);
			});
		}
	}, [user]);

	if (userLoading || !dataSnapshot) {
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

	const handleShowNewWhitelist = () => {
		setNewWhitelist(!newWhitelist);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewWhitelistName(e.target.value);
	};

	const handleWhitelistItemChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setNewWhitelistItems(e.target.value.split("\n"));
	};

	const reload = async () => {
		await getDocsFromServer(
			query(
				collection(firestore, "whitelists"),
				where("user", "==", user?.uid)
			)
		).then((querySnapshot) => {
			setDataSnapshot(querySnapshot);
		});
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();

		if (newWhitelistName == "") {
			setNewWhitelistPlaceholder(
				"Please enter a name for your whitelist"
			);

			return;
		}

		setNewWhitelistLoading(true);

		addDoc(collection(firestore, "whitelists"), {
			user: user?.uid,
			name: newWhitelistName,
			emails: newWhitelistItems,
		});

		setNewWhitelist(false);
		setNewWhitelistLoading(false);
		setNewWhitelistItems([""]);
		setNewWhitelistName("");
		setNewWhitelistPlaceholder("Whitelist Name");

		reload();
	};

	return (
		<div className="flex h-screen flex-col justify-between">
			<main className="mb-auto">
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
							Whitelists
						</h1>
						<button onClick={() => handleShowNewWhitelist()}>
							{newWhitelist ? (
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
					{newWhitelist && (
						<div className="col-span-5 col-start-3 my-8 flex flex-col items-center rounded border-2 border-gray-900 p-4 text-gray-900">
							<div className="flex w-full flex-col">
								<div className="flex w-full justify-between">
									<input
										onChange={(event) =>
											handleChange(event)
										}
										value={newWhitelistName}
										type="text"
										placeholder={newWhitelistPlaceholder}
										className={`h-12 w-96 rounded border-b-2 ${
											newWhitelistName
												? "border-neutral-800"
												: "border-red-500"
										} bg-neutral-200 p-2 text-gray-900 outline-none placeholder:italic placeholder:text-gray-400`}
									/>
									<button
										className="h-12 w-28 rounded border-2 border-gray-900 hover:bg-gray-900 hover:text-neutral-50"
										onClick={(event) => handleSubmit(event)}
									>
										{newWhitelistLoading
											? "Creating..."
											: "Create"}
									</button>
								</div>
								<label className="mt-4 -mb-1 font-bold text-gray-900">
									Whitelist:
								</label>
								<h4 className="font-light text-gray-500">
									Seperate each email adress with a new line
								</h4>
								<textarea
									className="mb-2 h-32 rounded border-b-2 border-gray-900 bg-neutral-200 p-2 outline-none"
									value={newWhitelistItems.join("\n")}
									onChange={handleWhitelistItemChange}
								/>
							</div>
						</div>
					)}
					<div className="col-span-5 col-start-3">
						{dataSnapshot.docs.map((list, i) => {
							let data = list.data();
							return (
								<WhitelistSplash
									name={data.name}
									whitelistItems={data.emails}
									id={list.id}
									key={list.id}
									reload={reload}
								/>
							);
						})}
						{dataSnapshot.docs.length === 0 && !newWhitelist && (
							<h4 className="p-96 font-light text-gray-500">
								<svg
									fill="none"
									stroke="currentColor"
									strokeWidth={1.5}
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
									className="mx-1 mb-1 inline-block h-5 w-5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
									/>
								</svg>
								Make a new whitelist with the plus button
							</h4>
						)}
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
