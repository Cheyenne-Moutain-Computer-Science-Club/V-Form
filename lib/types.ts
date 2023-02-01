export interface Form {
	header: string;
	options: {
		active: boolean;
		endDate: Date;
		submits: number;
		user: string;
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
