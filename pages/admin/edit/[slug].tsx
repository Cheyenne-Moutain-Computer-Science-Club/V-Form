import { useRouter } from "next/router";
import {
	collection,
	doc,
	setDoc,
	getDoc,
	getDocs,
	DocumentData,
	Timestamp,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import EditDropdownTypeSheet from "@/components/questionTypes/editable/EditDropdownFromSheet";
import { Question, FormOptions } from "@/lib/types";
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import { firestore } from "@lib/firebase";

const onMount = async (slug: any) => {
	const docRef = doc(firestore, "forms", `${slug}`);
	const docSnap = await getDoc(docRef);
	// console.log(`slug (${slug}) has doc?`, docSnap.exists());

	// Redirect if DNE
	if (!docSnap.exists()) {
		// router.push("/admin");
		return;
	} else {
		return docSnap.data();
	}
};

export default function Edit(
	props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
	const router = useRouter();

	const [formData, setFormData] = useState(Object);
	const [questionContent, setQuestionContent] = useState(Array<DocumentData>);
	const [whitelists, setWhitelists] = useState(Array<[string, string][]>);

	// Checkboxes
	const [checked, setChecked] = useState(Array<Boolean>);
	// Toggle state
	const [active, setActive] = useState(Boolean);
	// Unix epoch
	const [date, setDate] = useState(0);

	// Whitelist option preparation
	const whitelistAll = async () => {
		// Get all possible whitelists
		const docSnap = await getDocs(collection(firestore, "whitelists"));
		// setWhitelists(docSnap.docs);
		// An array of tuples [[id, name]...]
		let whitelistId_Name = Array(docSnap.docs.length);
		docSnap.docs.map((doc, i) => {
			const pair: readonly [id: String, name: String] = [
				doc.id,
				doc.data().name,
			];
			whitelistId_Name[i] = pair;
		});
		setWhitelists(whitelistId_Name);
		return whitelistId_Name;
	};

	// Runs on mount & slug change
	useEffect(() => {
		(async () => {
			// Get document based on URL slug
			const data = await onMount(props.slug);
			setFormData(data);
			// Set questions
			setQuestionContent(data?.questions);

			// Prepare whitelist states
			// activeWhitelists: Currently set whitelists from DB
			const activeWhitelists = data?.options?.whitelist;
			// allWhitelists: All possible whitelists from DB
			const allWhitelists = await whitelistAll();

			let checkedPop = Array(allWhitelists.length);
			allWhitelists.map((_, i) => {
				if (activeWhitelists?.includes(allWhitelists[i][0])) {
					checkedPop[i] = true;
				} else {
					checkedPop[i] = false;
				}
			});
			setChecked(checkedPop);

			// Prepare toggle & Date
			setActive(data?.options?.active);
			setDate(data?.options?.endDate.seconds * 1000);
			// console.log(date);
			// console.log(new Date(date * 1000).toISOString().replace("Z", "") + "");
		})();
	}, []);

	const updateContent = (i: number, content: Question) => {
		let contentCopy = questionContent;
		contentCopy[i] = content;
		setQuestionContent(contentCopy);
		// console.log(questionContent);
	};

	// Parse options to be saved to DB
	const prepareOptions = (): FormOptions => {
		// Whitelists
		let activeWhitelists = Array<string>();
		checked.map((_, i) => {
			if (checked[i]) {
				activeWhitelists.push(whitelists[i][0].toString());
			}
		});

		const finalOptions: FormOptions = {
			active: active,
			whitelist: activeWhitelists,
			endDate: Timestamp.fromDate(new Date(date)),
		};
		return finalOptions;
	};

	// Database outgoing interaction
	const handleSave = async () => {
		// TODO: remove blank lines
		// TODO: confirmation
		// console.log(questionContent);
		const options = prepareOptions();

		const docRef = doc(firestore, "forms", `${props.slug}`);
		await setDoc(
			docRef,
			{ questions: questionContent, options: options },
			{ merge: true }
		);
	};

	const addQuestion = () => {
		// let contentCopy = questionContent;
		const newQuestion: Question = {
			title: "New Question",
			description: "New Description",
			required: false,
			type: "dropdown",
			items: ["Item1", "Item2"],
			placeholder: "Placeholder",
		};
		// contentCopy.push(newQuestion);
		const newContent = [...questionContent, newQuestion];
		setQuestionContent(newContent);
		console.log(questionContent);
	};

	const removeQuestion = (i: number) => {
		let contentCopy = [...questionContent];
		contentCopy.splice(i, 1);
		setQuestionContent(contentCopy);
		// console.log(questionContent);
	};

	const questionSet = questionContent?.map(
		(question: DocumentData, i: number) => {
			// Sort question type
			switch (question.type) {
				case "dropdown":
					return (
						<div>
							<EditDropdownTypeSheet
								items={question.items}
								title={question.title}
								required={question.required}
								id={i}
								update={updateContent}
								remove={removeQuestion}
								description={question.description}
								placeholder={question.placeholder}
								key={uuidv4()}
							/>
						</div>
					);
				case "multiple select":
					return;
				case "multiple choice":
					return;
			}
		}
	);

	// Options things
	// const updateOptions = (option: number) => {
	//   let optionsCopy = formOptions;
	//   switch (option) {
	//     case (2):
	//       optionsCopy.whitelist =
	//   }
	// }

	const onChangeToggle = () => {
		setActive(!active);
	};

	const onChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
		// const year = new Date(event.target.value).getFullYear().toString();
		if (!event.target["validity"].valid /*|| year.length != 4*/) return;
		const iso8601 = event.target.value;
		const parsedDate = Date.parse(iso8601);
		setDate(parsedDate);
		// setDate(event.target.value);
	};

	const onChangeWhitelist = (i: number) => {
		let checkedCopy = [...checked];
		checkedCopy[i] = !checkedCopy[i];
		setChecked(checkedCopy);
		// console.log(checked);
	};
	// const whitelistSnapshot = (async () => {
	//   const docSnap = await getDocs(collection(db, "whitelist"));
	//   return docSnap;
	// })();
	const whitelistSet = whitelists.map((list, i) => {
		return (
			<div>
				<label className="ml-1">
					<input
						type="checkbox"
						// TODO: see if a better solution is available here
						checked={!!checked[i]}
						onChange={() => onChangeWhitelist(i)}
						className="checked:bg-accent mr-2 h-4 w-4 appearance-none rounded border-2 border-gray-900 bg-neutral-50 focus:ring-0"
					/>
					{list[1]}
				</label>
			</div>
		);
	});

	return (
		<div className="text-black">
			<div className="m-5">
				<h1 className="flex justify-center text-3xl font-semibold">
					{formData?.header}
				</h1>
			</div>
			<div className="m-5">
				<div className="border-2 border-gray-900">
					<h2 className="m-2 flex justify-center text-2xl font-semibold">
						Form Settings
					</h2>
					<hr className="mx-5 mb-3 h-1 rounded bg-neutral-200" />
					<div className="m-10 space-y-5">
						<label className="group relative flex items-center justify-start p-2 text-xl">
							<input
								type="checkbox"
								checked={active}
								onChange={() => onChangeToggle()}
								className="peer absolute left-1/2 h-full w-full -translate-x-1/2 appearance-none rounded-md"
							/>
							<span className="ml-4 flex h-10 w-16 flex-shrink-0 items-center rounded-full bg-gray-300 p-1 duration-300 ease-in-out after:h-8 after:w-8 after:rounded-full after:bg-white after:shadow-md after:duration-300 peer-checked:bg-black peer-checked:after:translate-x-6"></span>
							<span className="ml-5">Active</span>
						</label>
						<div>
							<h3 className="font-semibold underline">
								Whitelists:
							</h3>
							<div>{whitelistSet}</div>
						</div>
						<div>
							<label className="relativr group flex items-center justify-start p-2 text-xl">
								<span className="font-semibold">
									Enter and end date and time:
								</span>
								<input
									type="datetime-local"
									onChange={(event) => onChangeDate(event)}
									defaultValue={new Date(date)
										.toISOString()
										.slice(0, -8)}
									max="9999-12-31T00:00"
									className="ml-2 bg-gray-200"
								/>
							</label>
						</div>
					</div>
				</div>
				{questionSet}
				<div className="flex rounded border-2 border-gray-900 py-2">
					<svg
						aria-hidden="true"
						fill="none"
						stroke="currentColor"
						strokeWidth={1.5}
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						onClick={addQuestion}
						className="ml-2 h-8 w-8 rounded bg-gray-900 pt-1 text-neutral-50 hover:cursor-pointer hover:bg-blue-600"
					>
						<path
							d="M12 4.5v15m7.5-7.5h-15"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<h2 className="m-2 font-semibold">Add a question</h2>
				</div>
			</div>
			<div className="mb-5 flex justify-center">
				<button
					onClick={handleSave}
					className="rounded-md bg-green-500 px-7 py-2 hover:bg-green-400"
				>
					Save
				</button>
				<br className="m-2" />
				<button className="rounded-md bg-rose-500 px-6 py-2 hover:bg-rose-400">
					Cancel
				</button>
			</div>
		</div>
	);
}

export function getServerSideProps(context: GetServerSidePropsContext) {
	return {
		props: {
			slug: context.params?.slug,
		},
	};
}
