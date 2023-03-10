import { DocumentReference } from "firebase/firestore";

export interface Form {
	header: string;
	slug: string;
	options: {
		active: boolean;
		endDate: Date;
		submits: number;
		user: string;
		whitelists: DocumentReference<whitelist>;
	};
	questions: Question[];
}

export interface Question {
	title: string;
	description: string;
	placeholder: string;
	type: string;
	required: boolean;
	items: string[];
}

export interface whitelist {
	name: string;
	user: string;
	emails: string[];
}
