import { GetStaticPropsContext } from "next";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { auth, firestore } from "@lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { signIn } from "@lib/auth";
import { app } from '@lib/firebase';
import { collection, query, where, getDocs, getFirestore, doc, setDoc, getDoc, DocumentData } from 'firebase/firestore';
import DropdownTypeQuestion from "@components/questionTypes/DropdownType";
import { useState } from "react";
import { FirebaseApp } from "firebase/app";
import { link } from "fs";

const db = getFirestore(app);

export default function Poll() {
  // Get URL slug
  const router = useRouter();
  const { slug } = router.query /*?? ""*/;
  console.log("slug: " + slug);

  // Look for document
  const [value, loading, error, snapshot] = useDocumentData(doc(db, "forms", `${slug}`));
  if (!loading && (!value)) {
    router.push("/admin");
  }
  // console.log(value?.header);


  // // TODO: Move this function elsewhere
  // const checkExists = async () => {
  //    // Redirct to admin page if slug does not correspond to a real form
  //   const q = query(collection(db, 'forms'), where('name', '==', slug?.toString()));
  //   const querySnap = await getDoc(q);
  //   if (querySnap.empty) {
  //     router.push("/admin");
  //   } else {
  //     const doc = querySnap.docs[0].data();
  //     return doc;
  //   }
  // }
  // const form: object = checkExists();


  return (
    <div className="text-black">
      <div>
        <h1>{value?.header}</h1>
      </div>
    </div>
  )
}
