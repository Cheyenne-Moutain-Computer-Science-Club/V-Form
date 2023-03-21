import { GetServerSidePropsContext } from "next";
import { InferGetServerSidePropsType } from "next";
import { auth, firestore } from "@lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import {
	doc,
	query,
	collection,
	where,
	getDocs,
	addDoc,
	getDoc,
	DocumentSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Footer from "components/Footer";
import { Form, Whitelist } from "@/lib/types";
import LoadingPageState from "@/components/pageStates/Loading";
import SearchableDropdown from "@/components/inputs/SearchableDropdown";
import { Question } from "@/lib/types";
import { admin } from "@/lib/firebaseAdmin";
import nookies from "nookies";

export default function FormTaking(
	props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
	const value = props.form;
	const [questionResponses, setQuestionResponses] = useState([""]);
	const router = useRouter();

	const questionsData = value?.questions;
	const header = value?.header;

	const sumbitForm = async () => {
		let result = await getDocs(
			query(
				collection(firestore, "responses"),
				where("form", "==", props.slug),
				where("uid", "==", props.user.uid)
			)
		);

		if (result.docs.length > 0) {
			throw Error("User has already responded to this form!");
		} else {
			// create new response document
			await addDoc(collection(firestore, "responses"), {
				form: props.slug,
				uid: props.user?.uid,
				questionResponses: questionResponses,
			});
		}
		// add form to user doc
		// redirect to different page
		router.push({
			pathname: "/form/submitted",
			query: { slug: props.slug },
		});
	};

	const questionComponents = questionsData?.map((q: Question, i: number) => {
		return (
			<div className="my-8" key={i}>
				<div className="bg-accent flex h-12 items-center justify-between rounded-t border-2 border-gray-900 px-3">
					<h1 className="text-2xl font-bold text-gray-900">
						{i + 1}
					</h1>
					{q.required && (
						<svg
							aria-hidden="true"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
						>
							<path
								d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					)}
				</div>
				<div className="rounded-b border-2 border-t-0 border-gray-900 p-4">
					<h2 className="text-lg">{q.title}</h2>
					<h3 className="text-xs">{q.description}</h3>
					<SearchableDropdown
						options={q.items}
						selectedVal={questionResponses[i]}
						handleChange={(val) => {
							let spreadQuestionResponses = [
								...questionResponses,
							];
							spreadQuestionResponses[i] = val;
							setQuestionResponses(spreadQuestionResponses);
						}}
						placeholder={q.placeholder}
					/>
				</div>
			</div>
		);
	});

	return (
		<div className="flex h-screen flex-col justify-between">
			<main className="mb-auto">
				<div>
					<div className="mt-20 grid grid-cols-9 grid-rows-1">
						<h1 className="col-span-7 md:col-span-5 col-start-2 md:col-start-3 text-4xl font-bold text-gray-900">
							{header}
						</h1>
						<div className="col-span-7 md:col-span-5 col-start-2 md:col-start-3">
							{questionComponents}
						</div>

						<button
							onClick={() => sumbitForm()}
							className="col-start-4 md:col-start-5 h-12 w-36 rounded border-2 border-gray-900 hover:bg-gray-900 hover:font-bold hover:text-neutral-50"
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

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	try {
		const cookies = nookies.get(ctx);
		const token = await admin.auth().verifyIdToken(cookies.token);

		// the user is authenticated!
		const { uid, email } = token;
		if (!email) throw Error("User does not have an email");

		let responded = await admin
			.firestore()
			.collection("responses")
			.where("uid", "==", uid)
			.where("form", "==", ctx.params?.slug)
			.get()
			.then((snapshot) => {
				if (!snapshot.empty) {
					ctx.res.writeHead(302, {
						Location: "/form/responded?slug=" + ctx.params?.slug,
					});
					ctx.res.end();
					throw Error("User has already responded to this form");
				}
			});

		let form = await admin
			.firestore()
			.collection("forms")
			.where("slug", "==", ctx.params?.slug)
			.get()
			.then((snapshot) => {
				if (snapshot.empty) {
					ctx.res.writeHead(302, {
						location:
							"/form/does-not-exist?slug=" + ctx.params?.slug,
					});
					ctx.res.end();
					return null;
				}
				let data = snapshot.docs[0].data();

				if (
					data.options.endDate.toDate().getTime() <
					new Date().getTime()
				) {
					ctx.res.writeHead(302, {
						location: "/form/closed?slug=" + ctx.params?.slug,
					});
					ctx.res.end();
					return null;
				}

				data.options.endDate = data.options.endDate.toDate().toString();

				return data as Form;
			});

		let whitelists: string[] = form!.options.whitelists;

		let whitelistData = await Promise.all(
			whitelists?.map(async (whitelist) => {
				const snapshot = await admin
					.firestore()
					.collection("whitelists")
					.doc(whitelist)
					.get();
				return snapshot.data() as Whitelist;
			})
		);

		let whitelistEmails = whitelistData
			.map((whitelist) => {
				return whitelist.emails;
			})
			.flat();

		if (!whitelistEmails.includes(email)) {
			ctx.res.writeHead(302, {
				location: "/permissionDenied?slug=/form/" + ctx.params?.slug,
			});
			ctx.res.end();
		}

		return {
			props: {
				slug: ctx.params?.slug,
				form: form,
				user: { uid, email },
			},
		};
	} catch (err) {
		ctx.res.writeHead(302, {
			Location: "/login?slug=form/" + ctx.params?.slug,
		});
		ctx.res.end();

		return { props: {} as never };
	}
}
