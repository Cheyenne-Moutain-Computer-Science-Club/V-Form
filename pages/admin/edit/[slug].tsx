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
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Form, FormOptions, Question, Whitelist } from "@/lib/types";
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import { firestore } from "@lib/firebase";
import nookies from "nookies";
import { admin } from "@lib/firebaseAdmin";
import FormOptionsMenu from "@/components/edit/FormOptions";
import SearchableDropdownEdit from "@/components/edit/questionTypes/SearchableDropdownEdit";
import Footer from "components/Footer";
import { Id, ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "@/components/alerts/ConfirmationAlert";

export default function EditPage(
	props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
	const formData = props.form;

	const [formOptions, setFormOptions] = useState(props.form.options);
	const [questionContent, setQuestionContent] = useState(
		props.form.questions
	);

	const toastId = useRef<undefined | Id>();
	const [showFormOptions, setShowFormOptions] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const unloadHandler = (event: BeforeUnloadEvent) => {
		event.preventDefault();
		event.returnValue = "";
	};

	const updateOptions = (data: any, field: string) => {
		let optionsCopy = { ...formOptions };
		optionsCopy[field] = data;
		setFormOptions(optionsCopy);
		if (!toastId.current) {
			window.addEventListener("beforeunload", unloadHandler);
			toastId.current = toast.warn("Unsaved Changes", {
				position: "bottom-left",
				autoClose: false,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		}
	};

	const updateContent = (questionData: Question, i: number) => {
		let contentCopy = questionContent;
		contentCopy[i] = questionData;
		setQuestionContent(contentCopy);
		if (!toastId.current) {
			window.addEventListener("beforeunload", unloadHandler);
			toastId.current = toast.warn("Unsaved Changes", {
				position: "bottom-left",
				autoClose: false,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		}
	};

	// Database outgoing interaction
	const handleSave = async () => {
		let spreadOptionData = {
			questions: {
				...formOptions,
				endDate: Timestamp.fromDate(new Date(formOptions.endDate)),
			},
		};
		let spreadQuestionData = [...questionContent];

		let promise = setDoc(
			doc(firestore, "forms", `${props.slug}`),
			{ questions: spreadQuestionData, options: spreadOptionData },
			{ merge: true }
		);
		window.removeEventListener("beforeunload", unloadHandler);
		toast.dismiss(toastId.current);
		toastId.current = undefined;
		toast.promise(promise, {
			pending: "Saving...",
			success: "Changes saved!",
			error: "There was an error saving your changes",
		});
		await promise;
	};

	const addQuestion = () => {
		// let contentCopy = questionContent;
		const newQuestion: Question = {
			title: "",
			description: "",
			required: true,
			type: "dropdown",
			items: [],
			placeholder: "Please begin typing",
		};
		// contentCopy.push(newQuestion);
		const newContent = [...questionContent, newQuestion];
		setQuestionContent(newContent);
	};

	const removeQuestion = (i: number) => {
		let contentCopy = [...questionContent];
		contentCopy.splice(i, 1);
		setQuestionContent(contentCopy);
	};

	const questionSet = questionContent?.map((question: Question, i) => {
		return (
			<div className="col-span-5 col-start-2 my-4" key={uuidv4()}>
				<div className="bg-accent flex h-12 justify-between rounded-t border-2 border-gray-900 pl-2 pt-1 pr-2">
					<h1 className="text-accent text-2xl font-bold">{i + 1}</h1>
					<svg
						aria-hidden="true"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						className="h-8 w-8 items-center justify-center rounded p-1 text-gray-900 hover:cursor-pointer hover:bg-gray-900 hover:text-neutral-50"
						onClick={() => removeQuestion(i)}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
						/>
					</svg>
				</div>
				<SearchableDropdownEdit
					id={i}
					update={updateContent}
					questionData={question}
				/>
			</div>
		);
	});

	return (
		<div className="flex h-screen flex-col justify-between">
			<main className="mt-4 mb-auto grid grid-cols-7">
				<button
					onClick={() => setShowModal(true)}
					className="font-xl group col-span-1 col-start-2 flex items-center rounded bg-neutral-50 px-2 font-bold text-gray-900 hover:bg-gray-900 hover:text-neutral-50"
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
				</button>
				<h1 className="col-span-3 col-start-3 flex justify-center text-3xl font-semibold">
					{formData?.header}
				</h1>
				<div className="col-span-1 col-start-6 grid justify-items-end">
					<svg
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
						className="peer h-8 w-8 transition hover:rotate-45 hover:cursor-pointer"
						onClick={() => setShowFormOptions(!showFormOptions)}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
					<span className="absolute top-10 scale-0 rounded bg-gray-900 p-2 text-xs text-white peer-hover:scale-100">
						Form Settings
					</span>
				</div>
				{showFormOptions && (
					<FormOptionsMenu
						formOptions={props.form.options}
						whitelists={props.whitelists}
						update={updateOptions}
					/>
				)}
				{questionSet}
				<div className="col-start-4 my-4 flex items-center justify-center">
					<svg
						aria-hidden="true"
						fill="none"
						stroke="currentColor"
						strokeWidth={1.5}
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						onClick={addQuestion}
						className="h-8 w-8 rounded text-gray-900 hover:cursor-pointer hover:bg-gray-900 hover:text-neutral-50"
					>
						<path
							d="M12 4.5v15m7.5-7.5h-15"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<h2 className="mx-2 font-semibold">New Question</h2>
				</div>

				<div className="col-span-1 col-start-4 mb-5 flex items-center justify-center">
					<button
						onClick={handleSave}
						className="rounded border-0 border-gray-900 bg-emerald-500 px-7 py-2 text-neutral-50 hover:bg-emerald-500"
					>
						Save
					</button>
					<ToastContainer
						position="bottom-left"
						autoClose={5000}
						newestOnTop
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						theme="colored"
					/>
					{showModal ? (
						<ConfirmationModal
							closehandler={() => setShowModal(false)}
						/>
					) : null}
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

		// let user = await admin
		// 	.firestore()
		// 	.collection("users")
		// 	.doc(uid)
		// 	.get()
		// 	.then((snapshot) => {
		// 		let data = snapshot.data();
		// 		if (!snapshot.exists || data?.email !== email) {
		// 			ctx.res.writeHead(302, {
		// 				Location: "/permissionDenied?slug=" + ctx.params?.slug,
		// 			});
		// 			ctx.res.end();
		// 			throw Error(
		// 				"User does not have permission to view this page"
		// 			);
		// 		}
		// 	});
		
		let form: Form = await admin
			.firestore()
			.collection("forms")
			.where("options.user", "==", uid)
			.where("slug", "==", ctx.params?.slug)
			.get()
			.then((snapshot) => {
				if (snapshot.empty) {
					ctx.res.writeHead(302, {
						location:
							"/form/does-not-exist?slug=" + ctx.params?.slug,
					});
					ctx.res.end();
				}

				let data = snapshot.docs[0].data();
				data.options.endDate = data.options.endDate.toDate().toString();

				return data as Form;
			});

		let whitelists /*: Whitelist[] | null*/ = await admin
			.firestore()
			.collection("whitelists")
			.where("user", "==", uid)
			.get()
			.then((snapshot) => {
				let data: Whitelist[] = snapshot.docs.map((doc) => {
					let data = doc.data();
					data.id = doc.id;
					return data;
				}) as Whitelist[];

				return data;
				// return snapshot;
			});

		return {
			props: {
				form,
				whitelists,
				slug: ctx.params?.slug,
			},
		};
	} catch (err) {
		ctx.res.writeHead(302, { Location: "/login?slug=admin/forms" });
		ctx.res.end();

		return { props: {} as never };
	}
}
