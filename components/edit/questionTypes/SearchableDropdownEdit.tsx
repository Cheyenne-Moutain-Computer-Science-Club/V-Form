import { Question } from "@/lib/types";
import { useState } from "react";

export default function SearchableDropdownEdit({
	update,
	questionData,
	id,
}: {
	update: (questionData: Question, key: number) => void;
	questionData: Question;
	id: number;
}) {
	const [formData, setFormData] = useState<Question>({
		title: questionData.title,
		description: questionData.description,
		items: questionData.items,
		placeholder: "",
		required: false,
		type: "dropdown",
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => {
		let spreadFormData = { ...formData };
		if (e.target.name === "items")
			spreadFormData[e.target.name] = e.target.value.split("\n");
		else spreadFormData[e.target.name] = e.target.value;

		setFormData(spreadFormData);
		update(spreadFormData, id);
	};

	return (
		<div className="flex flex-col rounded-b border-2 border-t-0 border-gray-900 p-4">
			<input
				value={formData.title}
				onChange={handleChange}
				type="text"
				className="h-12 w-5/12 rounded border-b-2 border-neutral-900 bg-neutral-200 p-2 text-gray-900 outline-none placeholder:italic placeholder:text-gray-400"
				name="title"
				placeholder="Question title"
			/>
			<input
				value={formData.description}
				onChange={handleChange}
				className="my-2 h-8 w-full rounded border-b-2 border-gray-900 bg-neutral-200 p-2 text-xs outline-none placeholder:italic placeholder:text-gray-400"
				name="description"
				placeholder="Question description"
			/>
			<div className="mt-4 flex justify-between">
				<label className="font-bold text-gray-900" htmlFor="items">
					Dropdown Items:
				</label>
				<h4 className="font-light text-gray-500">
					<svg
						fill="none"
						stroke="currentColor"
						strokeWidth={1.5}
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
						className="mx-1 mb-1 inline-block h-5 w-5"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
						/>
					</svg>
					Seperate each option with a new line
				</h4>
			</div>
			<textarea
				value={formData.items.join("\n")}
				onChange={handleChange}
				className="h-32 w-full rounded border-b-2 border-gray-900 bg-gray-200 p-2 text-xs outline-none placeholder:italic placeholder:text-gray-400"
				name="items"
				placeholder="Dropdown items, seperated by new lines"
			/>
		</div>
	);
}
