import { GetServerSidePropsContext } from "next";
import { InferGetServerSidePropsType } from "next";
import { auth, firestore } from "@lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { signIn } from "@lib/auth";
import {
	doc,
	query,
	collection,
	where,
	getDocs,
	addDoc,
} from "firebase/firestore";
import DropdownTypeQuestion from "@components/questionTypes/DropdownType";
import { useState } from "react";
import Router from "next/router";
import Footer from "@/components/footer";
import MultipleChoiceTypeQuestion from "@/components/questionTypes/MultipleChoiceType";
import MultipleSelectTypeQuestion from "@/components/questionTypes/MultipleSelectType";

interface question {
	title: string;
	description: string;
	required: boolean;
	type: string;
	items: string[];
	placeholder: string;
}

export default function Form(
	props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
	const [user, authLoading, authError] = useAuthState(auth);
	const [value, dataLoading, dataError, snapshot] = useDocumentData(
		doc(firestore, `forms/${props.slug}`)
	);
	const [questionResponses, setQuestionResponses] = useState([""]);

	if (authLoading || dataLoading) {
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

	if (!user && !authLoading) {
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

	if (!dataLoading && !value) {
		return (
			<div className="flex h-screen flex-col justify-between">
				<main className="grid h-full items-center">
					<h1 className="text-center text-3xl font-bold text-gray-900">
						This form does not exist
					</h1>
				</main>
				<Footer />
			</div>
		);
	}

	getDocs(
		query(
			collection(firestore, "responses"),
			where("form", "==", props.slug),
			where("uid", "==", user?.uid)
		)
	).then((result) => {
		if (result.docs.length > 0) {
			Router.push({
				pathname: "/responded",
				query: { slug: props.slug },
			});
		}
	});

	const questionsData = value?.questions;
	const header = value?.header;
	const options = value?.options;

	if (
		!options.active ||
		options.endDate.toDate().getTime() < new Date().getTime()
	) {
		return (
			<div className="flex h-screen flex-col justify-between">
				<main className="grid h-full items-center">
					<h1 className="text-center text-3xl font-bold text-gray-900">
						This form is no longer taking responses
					</h1>
				</main>
				<Footer />
			</div>
		);
	}

	const sumbitForm = async () => {
		let result = await getDocs(
			query(
				collection(firestore, "responses"),
				where("form", "==", props.slug),
				where("uid", "==", user?.uid)
			)
		);

		if (result.docs.length > 0) {
			throw Error("User has already responded to this form!");
		} else {
			// create new response document
			await addDoc(collection(firestore, "responses"), {
				form: props.slug,
				uid: user?.uid,
				questionResponses: questionResponses,
			});
		}
		// add form to user doc
		// redirect to different page
		Router.push({
			pathname: "/submitted",
			query: { slug: props.slug },
		});
	};

	const updateQuestionResponses = (id: number, response: string) => {
		let spreadQuestionResponses = [...questionResponses];
		if (questionsData.length !== spreadQuestionResponses.length) {
			spreadQuestionResponses = Array.from(Array(questionsData.length));
		}
		spreadQuestionResponses[id] = response;
		setQuestionResponses(spreadQuestionResponses);
	};

	const questionComponents = questionsData.map((q: question, i: number) => {
		if (q.type === "dropdown") {
			return (
				<DropdownTypeQuestion
					items={q.items}
					title={q.title}
					required={q.required}
					id={i}
					key={i}
					update={updateQuestionResponses}
					description={q.description}
					placeholder={q.placeholder}
				/>
			);
		} else if (q.type === "multiple choice") {
			return (
				<MultipleChoiceTypeQuestion
					items={q.items}
					title={q.title}
					required={q.required}
					id={i}
					key={i}
					update={updateQuestionResponses}
					description={q.description}
				/>
			);
		} else if (q.type == "multiple select") {
			return (
				<MultipleSelectTypeQuestion
					items={q.items}
					title={q.title}
					required={q.required}
					id={i}
					key={i}
					update={updateQuestionResponses}
					description={q.description}
				/>
			);
		}
	});

	return (
		<div className="flex h-screen flex-col justify-between">
			<main className="mb-auto">
				<div>
					<div className="mt-20 grid grid-cols-9 grid-rows-1">
						<h1 className="col-span-5 col-start-3 text-4xl font-bold text-gray-900">
							{header}
						</h1>
						<div className="col-span-5 col-start-3">
							{questionComponents}
						</div>

						<button
							onClick={() => sumbitForm()}
							className="hover:bg-accent hover:text-accent col-start-5 h-12 w-36 rounded border-2 border-gray-900 hover:font-bold"
						>
							Submit
						</button>
					</div>
				</div>
			</main>
			<Footer />
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
