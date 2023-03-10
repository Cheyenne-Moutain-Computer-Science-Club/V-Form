import { useState } from "react";
import { Question } from "@/lib/types";

export default function EditDropdownTypeSheet({
	items,
	title,
	required,
	id,
	update,
	remove,
	description,
	placeholder,
}: {
	items: string[];
	title: string;
	required: boolean;
	id: number;
	update: (id: number, response: Question) => void;
	remove: (id: number) => void;
	description: string;
	placeholder: string;
}) {
	const editableFormat = () => {
		let str = "";
		items.forEach((item) => {
			str += item + "\n";
		});
		return str;
	};

	// Format data in accordance to question type before database updates
	const questionPrep = (data: any): Question => {
		const formatted: Question = {
			title: data[0],
			description: data[1],
			required: required,
			type: "dropdown",
			items: data[2],
			placeholder: placeholder,
		};
		return formatted;
	};

	const [formData, setFormData] = useState([title, description, items]);

	const handleChange = (
		event:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>,
		i: number
	): void => {
		let dataCopy = formData;
		if (i == 2) {
			// Format spreadsheet data before updatex
			const formatArr = event.target.value.split("\n");
			dataCopy[2] = formatArr;
		} else {
			// Normal data update
			dataCopy[i] = event.target.value;
		}

		setFormData(dataCopy);
		update(id, questionPrep(dataCopy));
	};

	return (
		<div className="my-8">
			<div className="bg-accent flex h-12 justify-between rounded-t border-2 border-gray-900 pl-2 pt-1 pr-2">
				<h1 className="text-accent text-2xl font-bold">{id + 1}</h1>
				<svg
					aria-hidden="true"
					fill="none"
					stroke="currentColor"
					strokeWidth={1.5}
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					className="h-8 w-8 items-center justify-center rounded bg-gray-900 text-neutral-50 hover:cursor-pointer hover:border-2 hover:border-gray-900 hover:bg-neutral-50 hover:text-gray-900"
					onClick={() => remove(id)}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M19.5 12h-15"
					/>
				</svg>
			</div>
			<div className="rounded-b border-2 border-t-0 border-gray-900 p-4">
				<form>
					<div className="flex flex-col">
						<input
							defaultValue={formData[0]}
							onChange={(event) => handleChange(event, 0)}
							type="text"
							className="mb-2 w-1/3 rounded border-b-2 border-gray-900 bg-gray-200 pl-2 text-lg"
						/>
						<textarea
							defaultValue={formData[1]}
							onChange={(event) => handleChange(event, 1)}
							className="h-12 w-full rounded border-b-2 border-gray-900 bg-gray-200 p-2 text-xs"
						/>

						<br className="my-3" />

						{/* TODO: Add instructions & maybe a number of names indicator */}
						<textarea
							defaultValue={editableFormat()}
							onChange={(event) => handleChange(event, 2)}
							className="h-72 w-full rounded border-b-2 border-gray-900 bg-gray-200 p-2 text-xs"
						/>
					</div>
				</form>
			</div>
		</div>
	);
}
