import { GetStaticPropsContext } from "next";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { auth, firestore } from "@lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { signIn } from "@lib/auth";
import { doc } from "firebase/firestore";
import DropdownTypeQuestion from "@components/questionTypes/DropdownType";
import { useState } from "react";

export default function Poll() {
  // Get URL slug
  const router = useRouter();
  const { slug } = router.query;

  return (
    <div className="text-white">
        <h1>{slug}</h1>
    </div>
  )
}
