import { GetStaticPropsContext } from "next";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { auth, firestore } from "@lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { signIn } from "@lib/auth";
import { app } from '@lib/firebase';
import { collection, query, where, getDocs, getFirestore, doc, setDoc, getDoc, DocumentData } from 'firebase/firestore';
import DropdownTypeQuestion from "@/components/questionTypes/DropdownType";
import { useState } from "react";
import { FirebaseApp } from "firebase/app";
import { link } from "fs";
import EditDropdownTypeSheet from "@/components/questionTypes/editable/EditDropdownFromSheet";

const db = getFirestore(app);

// TODO: investigate slightly more abstraction
interface question {
	title: string;
	description: string;
	required: boolean;
	type: string;
	items: string[];
	placeholder: string;
}

export default function Poll() {
  // Get URL slug
  const router = useRouter();
  const { slug } = router.query /*?? ""*/;
  // console.log("slug: " + slug);

  // Look for document
  const [value, loading, error, snapshot] = useDocumentData(doc(db, "forms", `${slug}`));
  if (!loading && (!value)) {
    router.push("/admin");
  }

  const [questionContent, setQuestionContent] = useState(value?.questions);

  const updateContent = (i: number, content: question) => {
    console.log("Content state updated");
    let contentCopy = questionContent;
    contentCopy[i] = content;
    setQuestionContent(contentCopy);
    // console.log(questionContent);
  }

  // Database outgoing interaction
  const handleSave = async () => {
    const docRef = doc(db, "forms", `${slug}`);
    await setDoc(docRef, {questions: questionContent}, {merge: true});
  }


  const questions: Array<DocumentData> = value?.questions;
  const questionSet = questions?.map((question: DocumentData, i: number) => {
    // Sort question type
    switch (question.type) {
      case ("dropdown"):
        return (
          <div>
              <EditDropdownTypeSheet 
                items={question.items} 
                title={question.title} 
                required={question.required} 
                id={i} 
                update={updateContent} 
                description={question.description} 
                placeholder={question.placeholder}
                key={i}
              />
          </div>
        );
      case ("multiple select"):
        return;
      case ("multiple choice"):
        return;
    }
  });

  return (
    <div className="text-black">
      <div>
        <h1>{value?.header}</h1>
      </div>
      <div>
        {questionSet}
      </div>
      <div>
        <button onClick={handleSave} className="bg-green-500, px-4 py-2">Save</button>
      </div>
    </div>
  )
}
