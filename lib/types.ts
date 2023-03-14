import { DocumentReference } from "firebase/firestore";

export interface Form {
	header: string;
	slug: string;
	options: FormOptions;
	questions: Question[];
}

export interface Question {
	[key: string]: string | boolean | string[];
	title: string;
	description: string;
	placeholder: string;
	type: string;
	required: boolean;
	items: string[];
}

export interface Whitelist {
	id: string;
	name: string;
	user: string;
	emails: string[];
}

export interface FormOptions {
	active: boolean;
	endDate: string;
	submits: number;
	user: string;
	whitelists: DocumentReference<Whitelist>;
}
