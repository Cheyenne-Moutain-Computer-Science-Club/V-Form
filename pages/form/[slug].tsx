import { GetServerSidePropsContext } from "next";
import { InferGetServerSidePropsType } from "next";
import { auth, firestore } from "@lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
	useDocumentData,
	useCollectionData,
} from "react-firebase-hooks/firestore";
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

interface question {
	title: string;
	description: string;
	required: boolean;
	type: string;
	items: string[];
}

export default function Form(
	props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
	const [user, authLoading, authError] = useAuthState(auth);
	const [value, dataLoading, dataError, snapshot] = useDocumentData(
		doc(firestore, `forms/${props.slug}`)
	);
	const [questionResponses, setQuestionResponses] = useState({});

	if (authLoading || dataLoading) return <div>Loading...</div>;
	if (!user && !authLoading) {
		return (
			<div>
				Please <button onClick={() => signIn()}>Log In</button> to
				continue
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
			Router.push("/");
		}
	});

	const questionsData = value?.questions;
	const header = value?.header;
	const options = value?.options;

	const sumbitForm = () => {
		// create new response document
		addDoc(collection(firestore, "responses"), {
			form: props.slug,
			uid: user?.uid,
			questionResponses: questionResponses,
		});
		// add form to user doc
		// redirect to different page
		// Router.push("/");
	};

	const updateQuestionResponses = (id: number, response: string) => {
		let spreadQuestionResponses = { ...questionResponses };
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
				/>
			);
		}
	});

	return (
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
					className="col-start-5 h-12 w-36 rounded border-2 border-gray-900 from-indigo-500 via-purple-500 to-pink-500 hover:bg-gradient-to-r hover:text-neutral-50"
				>
					Submit
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
