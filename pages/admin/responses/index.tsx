import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { Form } from "@/lib/types";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { InferGetServerSidePropsType } from "next";
import { getDocs, query, collection, where, getFirestore } from "firebase/firestore";
import Footer from "@/components/footer";
import { firestore } from "@/lib/firebase";
import { app } from "@/lib/firebase";
import FormSplash from "@/components/creation-tools/FormSplash";
import { signIn } from "@/lib/auth";
import FormSplashResponse from "@/components/creation-tools/FormSplashResponse";

const db = getFirestore(app);

function Responses() {
    const router = useRouter();

    // [[id, name], [id, name], ...]
    const [forms, setForms] = useState(Array<[string, string][]>)
    useEffect(() => {
        (async () => {
            const allForms = await getDocs(collection(db, "forms")); 
            const formTuples = allForms.docs.map((doc) => {
                return [doc.id, doc.data().header];
            });
            setForms(formTuples);
        })();
    }, []);
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
								Responses
							</h1>
						</div>

						<div className="col-span-5 col-start-3">
							{forms.map((form, i) => (
								<FormSplashResponse
									header={form[1].toString()}
									slug={form[0].toString()}
									key={i}
								/>
							))}
							{forms.length === 0  && (
								<h4 className="font-light text-gray-500">
									There are no forms. Create one at:
								</h4>
							)}
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
  )
}

export default Responses
