import Link from "next/link";
import { UserOptions, Question, Response } from "@/lib/types";
import { ResponseQuestion } from "@/lib/responseManagement";
import { useState, useEffect } from "react";
import { GetServerSidePropsContext } from "next";
import { InferGetServerSidePropsType } from "next";
import { doc, getDocs, getDoc, query, collection, where } from "firebase/firestore";
import Footer from "@/components/footer";
import { firestore } from "@/lib/firebase";
import { admin } from "@lib/firebaseAdmin";
import nookies from "nookies";

function SingleResponse(
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
    const [questions, setQuestions] = useState(Array<ResponseQuestion>);
    const [showAllOptions, setShowAllOptions] = useState(Array<Boolean>);

    useEffect(() => {
        (async () => {
            let responseData: Array<Response> = [];
            // Responses
            // const responses = await getDocs(
            //     query(
            //         collection(firestore, "responses"),
            //         where("form", "==", props.slug)
            //     )
            // );
            const responses = props.responses;

            if (responses.length === 0) {
                // ---
            } else {
                responseData = responses as Response[];
            }

            // Questions
            // form: The form being viewed
            // const form = await getDoc(doc(firestore, "forms", `${props.slug}`));
            const form = props.form;
            // A new instance of ResponseQuestion will be created for each question
            // allQuestions: An array of all ResponseQuestions that will be used for the questions state
            // let allQuestions: Array<ResponseQuestion> = [];


            const allQuestions = form.questions.map((ques: Question, i: number) => {
                // prompt: The question prompt + description
                const prompt = ques.title + ": " + ques.description;
                
                // userItemData: An array of all UserOptions for the current question
                const userItemData = ques.items.map((currentItem, j) => {
                    // itemResponses: An array of all responses to the current item
                    const itemResponses = responseData.map((response) => {return response.questionResponses[i]});
                    const numOccurences = itemResponses.filter((response) => {return response === currentItem}).length;
                    // Make options using UserOptions
                    const options: UserOptions = {
                        optionText: currentItem,
                        numChosen: numOccurences
                    };
                    return options;
                });

                // num_responses: The number of responses to the current FORM
                // TODO: Turn this into number of responses to the current QUESTION
                const num_responses = responseData.length;

                let question: ResponseQuestion = new ResponseQuestion(prompt, userItemData, num_responses);
                question.sortOptions();
                return question;

            });
            setQuestions(allQuestions);

            // Prepare state
            setShowAllOptions(Array(allQuestions.length).fill(false));
        })();
    }, []);
 

    const handleShowOptions = (i: number) => {
        const newShowAllOptions = [...showAllOptions];
        newShowAllOptions[i] = !newShowAllOptions[i];
        setShowAllOptions(newShowAllOptions);
    }

    const responseSet = questions.map((question, i) => {
        const optionsToRender = showAllOptions[i] ? question.getOptions() : question.getOptions().slice(0, 5);
        const buttonState = question.getOptions().length <=5 ? false : showAllOptions[i] ? "Show Less" : "Show More";


        return (
            <div className="mx-40 my-8 border-2 border-gray-900 p-4 rounded flex flex-col">
                <h2 className="font-semibold">{i + 1}. {question.getQuestionText()}</h2>
                <div className="my-2">
                    {optionsToRender.map((option, j) => {
                        const percent = question.getPercent(j);
                        return (
                            <div className="mt-5 flex items-start flex-col">
                                <h3>{option.optionText}</h3>
                                <div className="relative w-1/4 pt-1">
                                    <div className="flex mb-2 items-center justify-between">
                                        <div className="justify-between">
                                            <span className="text-xs font-semibold inline-block">
                                                {option.numChosen}/{question.getNumTotalResponses()}
                                            </span>
                                            
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                                        <div style={{ width: percent.toString() + "%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                                    </div>
                                    <span className="text-xs font-semibold inline-block text-green-600">
                                        {percent}%
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {buttonState && (<button onClick={() => handleShowOptions(i)} className="text-s text-gray-500">{buttonState}</button>)}
            </div>
        );
    });

    return (
        <div className="flex h-screen flex-col justify-between">
            <main className="mb-auto">
                <div>
                    <div className="mt-20 grid grid-cols-9 grid-rows-1">
                        <div className="col-span-5 col-start-3 flex w-full justify-between">
                            <Link
                                href="/admin/responses"
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
                                {props.slug}
                            </h1>
                        </div>
                    </div>
                    <div className="mt-10">
                        {responseSet}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    try {
		const cookies = nookies.get(context);
		const token = await admin.auth().verifyIdToken(cookies.token);

		// the user is authenticated!
		const { uid, email } = token;    
        const slug = context.params?.slug;

        let responses = await admin
            .firestore()
            .collection("responses")
            .where("form", "==", slug)
            .get()
            .then((snapshot) => {
                snapshot.docs.map((doc) => {
                    let data = doc.data();
                    return data;
                });
                return snapshot;
            });

        let form = await admin
            .firestore()
            .collection("forms")
            .where("slug", "==", slug)
            .get()
            .then((snapshot) => {
                let data = snapshot.docs[0].data()
                data.options.endDate = data.options.endDate.toDate().toString();
                return data;
            });
        

        return {
            props: {
                slug: slug,
                responses,
                form
            },
        };
    } catch (err) {
        context.res.writeHead(302, { Location: "/login?slug=admin/responses" });
		context.res.end();

		return { props: {} as never };
    }
}
export default SingleResponse
