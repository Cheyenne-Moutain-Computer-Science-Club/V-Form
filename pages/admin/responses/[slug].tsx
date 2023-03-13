import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { Form, UserOptions, Question, Response } from "@/lib/types";
import { ResponseQuestion } from "@/lib/responseManagement";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { InferGetServerSidePropsType } from "next";
import { doc, getDocs, getDoc, query, collection, where } from "firebase/firestore";
import Footer from "@/components/footer";
import { firestore } from "@/lib/firebase";
import FormSplash from "@/components/creation-tools/FormSplash";
import { signIn } from "@/lib/auth";

function SingleResponse(
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
    const router = useRouter();

    // const [responseData, setResponseData] = useState([] as Form[])
    // Array<questions: Array<UserOptions[], num_total_responses>>
    const [questions, setQuestions] = useState(Array<ResponseQuestion>);


    useEffect(() => {
        (async () => {
            let responseData: Array<Response> = [];
            // Responses
            const responses = await getDocs(
                query(
                    collection(firestore, "responses"),
                    where("form", "==", props.slug)
                )
            );
            if (responses.docs.length === 0) {
                // ---
            } else {
                responseData = responses.docs.map((doc) =>
					doc.data()
				) as Response[];
                // setResponseData(data);
                console.log(responseData);
            }

            // Questions
            // form: The form being viewed
            const form = await getDoc(doc(firestore, "forms", `${props.slug}`));
            console.log(form.data());
            // A new instance of ResponseQuestion will be created for each question
            // allQuestions: An array of all ResponseQuestions that will be used for the questions state
            // let allQuestions: Array<ResponseQuestion> = [];


            const allQuestions = form.data()?.questions.map((ques: Question, i: number) => {
                // prompt: The question prompt + description
                const prompt = ques.title + ": " + ques.description;
                
                // userItemData: An array of all UserOptions for the current question
                const userItemData = ques.items.map((currentItem) => {
                    // itemResponses: An array of all responses to the current item
                    const itemResponses = responseData.map((response) => {return response.questionResponses[i]});
                    const numOccurences = itemResponses.filter((response) => {response === currentItem}).length;
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

        })();
    }, []);
    // console.log(responseData);

  return (
    <div>Responses</div>
  )
}

export function getServerSideProps(context: GetServerSidePropsContext) {
    const slug = context.params?.slug ?? null;
	return {
		props: {
			slug: slug,
		},
	};
}
export default SingleResponse
