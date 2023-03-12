import { useRouter } from "next/router";
import { app } from '@lib/firebase';
import { collection, getFirestore, doc, setDoc, getDoc, getDocs, DocumentData, Timestamp } from 'firebase/firestore';
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import EditDropdownTypeSheet from "@/components/questionTypes/editable/EditDropdownFromSheet";
import StickyAlert from "@/components/stickyAlert";

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

interface options {
  active: boolean;
  whitelist: string[]; // Array of strings with whitelist ids
  endDate: Timestamp;
}

const onMount = async (slug: any) => {
  const docRef = doc(db, "forms", `${slug}`);
    const docSnap = await getDoc(docRef);
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
  const { slug } = router.query /*?? ""*/

  const [formData, setFormData] = useState(Object);
  const [questionContent, setQuestionContent] = useState(Array<DocumentData>);
  const [whitelists, setWhitelists] = useState(Array<[string, string][]>);

  // Checkboxes
  const [checked, setChecked] = useState(Array<Boolean>);
  // Toggle state
  const [active, setActive] = useState(Boolean);
  // Unix epoch
  const [date, setDate] = useState(0);

  // Alert
  const [showAlert, setShowAlert] = useState(false);


  // Whitelist option preparation
  const whitelistAll = async () => {
    // Get all possible whitelists
    const docSnap = await getDocs(collection(db, "whitelists"));
    // An array of tuples [[id, name]...]
    let whitelistId_Name = Array(docSnap.docs.length);
    docSnap.docs.map((doc, i) => {
      const pair: readonly [id: String, name: String] = [doc.id, doc.data().name];
      whitelistId_Name[i] = pair;
    });
    setWhitelists(whitelistId_Name);
    return whitelistId_Name;
  };

  // Runs on mount & slug change
  useEffect(() => {
    (async () => {
      // Get document based on URL slug
      const data = await onMount(slug);
      setFormData(data);
      // Set questions
      setQuestionContent(data?.questions);


      // Prepare whitelist states
      // activeWhitelists: Currently set whitelists from DB
      const activeWhitelists = data?.options?.whitelist;
      // allWhitelists: All possible whitelists from DB
      const allWhitelists = await whitelistAll();

      let checkedPop = Array(allWhitelists.length);
      allWhitelists.map((_, i) => {
        if (activeWhitelists?.includes(allWhitelists[i][0])) {
          checkedPop[i] = true;
        } else {
          checkedPop[i] = false;
        }
      });
      setChecked(checkedPop);


      // Prepare toggle & Date
      setActive(data?.options?.active);
      setDate(data?.options?.endDate.seconds * 1000);
    })();
  }, [router]);


  const updateContent = (i: number, content: question) => {
    let contentCopy = questionContent;
    contentCopy[i] = content;
    setQuestionContent(contentCopy);
  }

  // Parse options to be saved to DB
  const prepareOptions = (): options => {
    // Whitelists
    let activeWhitelists = Array<string>();
    checked.map((_, i) => {
      if (checked[i]) {
        activeWhitelists.push(whitelists[i][0].toString());
      }
    });

    const finalOptions: options = {
      active: active,
      whitelist: activeWhitelists,
      endDate: Timestamp.fromDate(new Date(date))
    }
    return finalOptions;
  }

  // Database outgoing interaction
  const handleSave = async () => {
    setShowAlert(false);
    // TODO: remove blank lines
    // TODO: confirmation
    const options = prepareOptions();

    const docRef = doc(db, "forms", `${slug}`);
    await setDoc(docRef, {questions: questionContent, options: options}, {merge: true});
    setShowAlert(true);
  }

  const addQuestion = () => {
    const newQuestion: question = {
      title: "New Question",
      description: "New Description",
      required: false,
      type: "dropdown",
      items: ["Item1", "Item2"],
      placeholder: "Placeholder"
    }
    const newContent = [...questionContent, newQuestion];
    setQuestionContent(newContent);
  }

  const removeQuestion = (i: number) => {
    let contentCopy = [...questionContent];
    contentCopy.splice(i, 1);
    setQuestionContent(contentCopy);
  }
  
  const questionSet = questionContent?.map((question: DocumentData, i: number) => {
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
                remove={removeQuestion}
                description={question.description} 
                placeholder={question.placeholder}
                key={uuidv4()}
              />
          </div>
        );
      case ("multiple select"):
        return;
      case ("multiple choice"):
        return;
    }
  });


  const onChangeToggle = () => {
    setActive(!active);
  }

  const onChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target['validity'].valid /*|| year.length != 4*/) return;
    const iso8601 = event.target.value;
    const parsedDate = Date.parse(iso8601);
    setDate(parsedDate);
  }

  const onChangeWhitelist = (i: number) => {
    let checkedCopy = [...checked];
    checkedCopy[i] = !checkedCopy[i];
    setChecked(checkedCopy);
  }

  const whitelistSet = whitelists.map((list, i) => {
    return (
      <div>
        <label className="ml-1">
          <input
                  type="checkbox"
                  // TODO: see if a better solution is available here
                  checked={!!checked[i]}
                  onChange={() => onChangeWhitelist(i)}
                  className="mr-2 checked:bg-accent h-4 w-4 appearance-none rounded border-2 border-gray-900 bg-neutral-50 focus:ring-0"
                />
        {list[1]}</label>
      </div>
    );
  });

  return (
    <div className="text-black">
      <div className="m-5">
        <h1 className="font-semibold flex justify-center text-3xl">{formData?.header}</h1>
      </div>
      <div className="m-5">
        <div className="border-2 border-gray-900">
          <h2 className="flex text-2xl justify-center m-2 font-semibold">Form Settings</h2>
          <hr className="bg-neutral-200 h-1 rounded mx-5 mb-3"/>
          <div className="m-10 space-y-5">
              <label className="relative flex justify-start items-center group p-2 text-xl">
                <input 
                type="checkbox" 
                checked={active}
                onChange={() => onChangeToggle()}
                className="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md" />
                <span className="w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-black after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6"></span>
                <span className="ml-5">Active</span>
              </label>
            <div>
              <h3 className="font-semibold underline">Whitelists:</h3>
              <div>
                {whitelistSet}
              </div>
            </div>
            <div>
              <label className="relativr flex justify-start items-center group p-2 text-xl">
                <span className="font-semibold">Enter and end date and time:</span>
                <input
                type="datetime-local"
                onChange={(event) => onChangeDate(event)}
                defaultValue={new Date(date).toISOString().slice(0, -8)}
                min={new Date().toString()}
                max="2025-06-12T00:00"
                className="bg-gray-200 ml-2"/>
              </label>
            </div>
          </div>
        </div>
        {questionSet}
        <div className="border-2 border-gray-900 rounded py-2 flex">
          <svg
					aria-hidden="true"
					fill="none"
					stroke="currentColor"
					strokeWidth={1.5}
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
          onClick={addQuestion}
					className="ml-2 h-8 w-8 rounded pt-1 text-neutral-50 bg-gray-900 hover:bg-blue-600 hover:cursor-pointer"
						>
  					<path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round"/>
				  </svg>
          <h2 className="m-2 font-semibold">Add a question</h2>
        </div>
      </div>
      <div className="justify-center flex mb-5">
        <button onClick={handleSave} className="rounded-md bg-green-500 px-7 py-2 hover:bg-green-400">Save</button>
        <br className="m-2"/>
        <button className="bg-rose-500 px-6 py-2 rounded-md hover:bg-rose-400">Cancel</button>
      </div>
      {showAlert ? (
        <StickyAlert
          closehandler={() => setShowAlert(false)}
          title="Form saved -"
          text={"Last saved: " + new Date().toLocaleString()}
          color="green"
        />
      ) : null}
      <br className="my-7"/>
    </div>
  )
}