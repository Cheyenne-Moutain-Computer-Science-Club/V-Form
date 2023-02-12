import { useState } from "react";

interface question {
	title: string;
	description: string;
	required: boolean;
	type: string;
	items: string[];
	placeholder: string;
}

export default function EditDropdownTypeSheet({
	items,
	title,
	required,
	id,
	update,
	description,
	placeholder,
}: {
	items: string[];
	title: string;
	required: boolean;
	id: number;
	update: (id: number, response: question) => void;
	description: string;
	placeholder: string;
}) {

	const editableFormat = () => {
		let str = "";
		items.forEach((item) => {
			str += item + "\n";
		});
		return str;
	}

	// Format data in accordance to question type before database updates
	const questionPrep = (data: any): question => {
		const formatted: question = {
			title: data[0],
			description: data[1],
			required: required,
			type: "dropdown",
			items: data[2],
			placeholder: placeholder
		}
		return formatted;
	}

	const [formData, setFormData] = useState([title, description, items]);


	const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>, i: number): void => {
		let dataCopy = formData;
		if (i == 2) {
			// Format spreadsheet data before updatex
			const formatArr = event.target.value.split("\n")
			dataCopy[2] = formatArr;
		} else {
			// Normal data update
			dataCopy[i] = event.target.value;
		}

        setFormData(dataCopy);
		update(id, questionPrep(dataCopy));
    }

	return (
		<div className="my-8">
			<div className="rounded-t border-2 border-gray-900 pl-2 pt-1 h-12 bg-accent flex justify-between pr-2">
				<h1 className="text-accent text-2xl font-bold">
					{id + 1}
				</h1>
				<svg
					aria-hidden="true"
					fill="none"
					stroke="currentColor"
					strokeWidth={1.5}
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					className="h-8 w-8 rounded pt-1 text-neutral-50 bg-gray-900 hover:bg-blue-600 hover:cursor-pointer"
						>
  					<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />

				</svg>
			</div>
			<div className="rounded-b border-2 border-t-0 border-gray-900 p-4">
				<form>
					<div className="flex flex-col">
						<input defaultValue={formData[0]} onChange={(event) => handleChange(event, 0)} type="text" className="text-lg bg-gray-200 w-1/3 mb-2"/>
						<textarea defaultValue={formData[1]} onChange={(event) => handleChange(event, 1)} className="text-xs bg-gray-200 w-4/5 h-12"/>

						<br className="my-3"/>

						{/* TODO: Add instructions & maybe a number of names indicator */}
						<textarea defaultValue={editableFormat()} onChange={(event) => handleChange(event, 2)} className="bg-gray-200 text-xs w-72 h-72"/>
					</div>
				</form>
			</div>
		</div>
	);
}