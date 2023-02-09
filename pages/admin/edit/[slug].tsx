import { useRouter } from "next/router";
import { app } from '@lib/firebase';
import { getFirestore, doc, setDoc, getDoc, DocumentData } from 'firebase/firestore';
import { useState, useEffect } from "react";
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

const onMount = async (slug: any) => {
  const docRef = doc(db, "forms", `${slug}`);
    const docSnap = await getDoc(docRef);
    // console.log(`slug (${slug}) has doc?`, docSnap.exists());

    // Redirect if DNE
    if (!docSnap.exists()) {
      // router.push("/admin");
      return;
    } else {
      return docSnap.data();
    }
}

export default function Edit() {
  const router = useRouter();
  // Get URL slug
  const { slug } = router.query /*?? ""*/;

  const [formData, setFormData] = useState(Object);
  const [questionContent, setQuestionContent] = useState(Array<DocumentData>);

  useEffect(() => {
    (async () => {
      const data = await onMount(slug);
      setFormData(data);
      setQuestionContent(data?.questions);
    })();
  }, [router]);
  // console.log("slug: " + slug);


  const updateContent = (i: number, content: question) => {
    let contentCopy = questionContent;
    contentCopy[i] = content;
    setQuestionContent(contentCopy);
    // console.log(questionContent);
  }

  // Database outgoing interaction
  const handleSave = async () => {
    // TODO: remove blank lines
    // TODO: confirmation
    // console.log(questionContent);
    const docRef = doc(db, "forms", `${slug}`);
    await setDoc(docRef, {questions: questionContent}, {merge: true});
  }


  const questions: Array<DocumentData> = questionContent;
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
        <h1>{formData?.header}</h1>
      </div>
      <div>
        {questionSet}
      </div>
      <div>
        <button onClick={handleSave} className="bg-green-500, px-4 py-2">Save</button>
        <button className="bg-rose-500">Cancel</button>
      </div>
    </div>
  )
}