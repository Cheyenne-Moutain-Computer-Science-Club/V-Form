import { GetStaticPropsContext } from "next";
import { InferGetServerSidePropsType } from "next";
import { auth, firestore } from "@lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { signIn } from "@lib/auth";
import { doc } from "firebase/firestore";
import DropdownTypeQuestion from "@components/questionTypes/DropdownType";
import { useState } from "react";

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

	const questionsData = value?.questions;
	const header = value?.header;
	const options = value?.options;

	const sumbitForm = () => {
		// create new response document
		// add form to user doc
		// redirect to different page
	};

	const updateQuestionResponses = (id: number, response: string) => {
		let spreadQuestionResponses = { ...questionResponses };
		spreadQuestionResponses[id] = response;
		setQuestionResponses(spreadQuestionResponses);
		console.log(spreadQuestionResponses);
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
			<h1>{header}</h1>
			<div className="mt-20 grid grid-cols-9 grid-rows-1">
				<div className="col-span-7 col-start-2">
					{questionComponents}
				</div>

				<button>Submit</button>
			</div>
		</div>
	);
}

export function getServerSideProps(context: GetStaticPropsContext) {
	return {
		props: {
			slug: context.params?.slug,
		},
	};
}
