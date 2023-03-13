import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { Form } from "@/lib/types";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { InferGetServerSidePropsType } from "next";
import { getDocs, query, collection, where } from "firebase/firestore";
import Footer from "@/components/footer";
import { firestore } from "@/lib/firebase";
import FormSplash from "@/components/creation-tools/FormSplash";
import { signIn } from "@/lib/auth";

function SingleResponse(
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
    const router = useRouter();

    const [responseData, setResponseData] = useState([] as Form[])
    useEffect(() => {
        (async () => {
            const responses = await getDocs(
                query(
                    collection(firestore, "forms"),
                    where("form", "==", props.slug)
                )
            );
            if (responses.docs.length === 0) {
                //
            } else {
                const data = responses.docs.map((doc) =>
					doc.data()
				) as Form[];
                setResponseData(data);
            }
        })();
    }, []);
    console.log(responseData);
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
