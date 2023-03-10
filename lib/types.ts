import { DocumentReference } from "firebase/firestore";

export interface Form {
	header: string;
	slug: string;
	options: FormOptions;
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

export interface Whitelist {
	name: string;
	user: string;
	emails: string[];
}

export interface FormOptions {
	active: boolean;
	endDate: Date;
	submits: number;
	user: string;
	whitelists: DocumentReference<Whitelist>;
}
