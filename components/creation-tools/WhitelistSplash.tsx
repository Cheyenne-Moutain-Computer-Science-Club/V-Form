import { updateDoc, doc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "@/lib/firebase";
import { ChangeEvent } from "react";

export default function WhitelistSplash({
	name,
	whitelistItems,
	id,
	reload,
}: {
	name: string;
	whitelistItems: string[];
	id: string;
	reload: () => void;
}) {
	const [open, setOpen] = useState(false);
	const [whitelistName, setWhitelistName] = useState(name);
	const [whitelist, setWhitelist] = useState(whitelistItems);
	const [deleteExpanded, setDeleteExpanded] = useState(false);
	const [whitelistPlaceholder, setWhitelistPlaceholder] =
		useState("Whitelist Name");

	useEffect(() => {
		setWhitelistName(name);
		setWhitelist(whitelistItems);
	}, []);

	const updateWhitelistName = (e: React.ChangeEvent<HTMLInputElement>) => {
		setWhitelistName(e.target.value);
	};

	const updateWhitelist = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setWhitelist(event.target.value.split("\n"));
	};

	const updateDelete = async () => {
		await deleteDoc(doc(firestore, "whitelists", id));
		reload();
	};

	const updateDeleteExpanded = () => {
		setDeleteExpanded(!deleteExpanded);
	};

	const updateOpen = () => {
		if (open && whitelistName !== "") {
			// send update to server
			updateDoc(doc(firestore, "whitelists", id), {
				name: whitelistName,
				emails: whitelist,
			});

			setOpen(!open);
		} else if (open && whitelistName === "") {
			setWhitelistPlaceholder("Please enter a name for your whitelist");
		} else {
			setOpen(!open);
		}
	};

	return (
		<div className="my-8 rounded border-2 border-gray-900">
			<div className="flex w-full justify-between p-4">
				{!open && <h2 className="text-xl">{whitelistName}</h2>}
				{open && (
					<input
						value={whitelistName}
						placeholder={whitelistPlaceholder}
						onChange={updateWhitelistName}
						className={`h-10 w-96 rounded border-b-2 ${
							whitelistName ? "border-gray-900" : "border-red-500"
						} bg-neutral-200 p-2 outline-none placeholder:italic placeholder:text-gray-400`}
					></input>
				)}
				<div className="flex w-20 justify-between">
					{!deleteExpanded && (
						<svg
							aria-hidden="true"
							fill="none"
							stroke="currentColor"
							strokeWidth={1.5}
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							className="h-8 w-8 rounded pt-1 text-gray-900 hover:bg-gray-900 hover:text-neutral-50"
							onClick={() => updateOpen()}
						>
							{open ? (
								<path
									d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							) : (
								<path
									d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							)}
						</svg>
					)}
					{!deleteExpanded && (
						<svg
							aria-hidden="true"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							className="h-8 w-8 rounded p-1 text-gray-900 hover:bg-gray-900 hover:text-neutral-50"
							onClick={() => updateDeleteExpanded()}
						>
							<path
								d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					)}
				</div>
				{deleteExpanded && (
					<div className="flex w-96 items-center justify-end">
						<svg
							aria-hidden="true"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							className="h-8 w-8 rounded p-1 text-gray-900 hover:bg-gray-900 hover:text-neutral-50"
							onClick={() => updateDelete()}
						>
							<path
								d="M4.5 12.75l6 6 9-13.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						<p className="text-italic mx-6 text-sm">
							Are you sure you would like to delete?
						</p>
						<svg
							aria-hidden="true"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							className="h-8 w-8 rounded p-1 text-gray-900 hover:bg-gray-900 hover:text-neutral-50"
							onClick={() => updateDeleteExpanded()}
						>
							<path
								d="M6 18L18 6M6 6l12 12"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
				)}
			</div>
			{open && (
				<div className="flex flex-col px-6">
					<h4 className="font-light text-gray-500">
						Close the menu in order to save
					</h4>
					<label className="font-bold text-gray-900">
						Whitelist:
					</label>
					<textarea
						className="mb-2 rounded border-b-2 border-gray-900 bg-neutral-200 p-2 outline-none"
						value={whitelist.join("\n")}
						onChange={updateWhitelist}
					/>
				</div>
			)}
		</div>
	);
}

/*
Cool gradient slide effect:
<div className="my-8">
			<div className="bg-accent rounded border-2 border-gray-900 bg-size-200 bg-pos-0 p-4 transition-all duration-500 hover:bg-pos-100">
				<h2 className="text-lg">{header}</h2>
			</div>
		</div>
 */
