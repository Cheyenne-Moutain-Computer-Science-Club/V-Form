import React from 'react';
import { NextRouter, useRouter } from 'next/router';
import { app } from '@lib/firebase';
import { collection, query, where, getDocs, getFirestore, doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

interface Poll {
    header: string,
    options: Object,
    questions: Array<Map<string, any>>
}

const db = getFirestore(app)


function New() {
    const [nameInput, setNameInput] = React.useState<string>("");
    const router: any = useRouter();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setNameInput(event.target.value);
    }

    const handleSubmit = async (event: React.SyntheticEvent): Promise<void> => {
        event.preventDefault();

        // TODO: Make this not an infinite loop with a break
        while (true) {
            // Generate ID
            const formID: string = uuidv4().toString().substring(0, 8);

            // Pull known form names
            const q = query(collection(db, 'forms'), where('name', '==', formID))
            const querySnap = await getDocs(q);

            // If the form ID is taken, regenerate
            if (querySnap.empty) {
                // Create form
                const poll: Poll = {
                    header: nameInput,
                    options: {
                        active: true,
                        end: null,
                        submits: 1
                    },
                    questions: []
                }

                const formRef = doc(db, 'forms', formID);
                setDoc(formRef, poll);

                // Redirect to edit page
                router.push(`/admin/edit/${formID}`);
                break;
            }
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input onChange={(event) => handleChange(event)} type="text" placeholder="Form Name" />
                <button className="bg-green-500" type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default New