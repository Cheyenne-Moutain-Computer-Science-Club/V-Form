import { Question } from "@/lib/types";
import { useState } from "react";

export default function SearchableDropdownEdit({
	update,
	deleteQuestion,
	questionData,
	id,
}: {
	update: (questionData: Question, key: number) => void;
	deleteQuestion: (id: number) => void;
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

	const [showDescription, setShowDescription] = useState<boolean>(false);
	const [showPopup, setShowPopup] = useState<boolean>(false);

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
		<div className="flex flex-col rounded-b p-4 shadow-lg">
			<div className="flex justify-between">
				<input
					value={formData.title}
					onChange={handleChange}
					type="text"
					className="h-12 w-5/12 rounded border-b-2 border-neutral-900 bg-neutral-200 p-2 text-gray-900 outline-none placeholder:italic placeholder:text-gray-400"
					name="title"
					placeholder="Question title"
				/>
				<svg
					fill="none"
					stroke="currentColor"
					strokeWidth={2}
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
					className="m-1 h-8 w-8 cursor-pointer rounded hover:bg-gray-900 hover:text-neutral-50"
					onClick={() => setShowPopup(!showPopup)}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
					/>
				</svg>
				{showPopup && (
					<div
						className="absolute right-20 z-10 w-1/12 origin-top-right rounded-md bg-neutral-50 shadow-lg"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="menu-button"
					>
						<div className="py-1">
							<a
								className="block cursor-pointer px-4 py-2 text-sm text-gray-900 hover:bg-neutral-200"
								onClick={() =>
									setShowDescription(!showDescription)
								}
							>
								{showDescription ? "Hide" : "Show"} description
							</a>
							{/* <a
								href="#"
								className="block px-4 py-2 text-sm text-gray-700"
							>
								Support
							</a> */}
							<a
								className="block cursor-pointer px-4 py-2 text-sm text-gray-900 hover:bg-neutral-200"
								onClick={() => deleteQuestion(id)}
							>
								Delete Question
							</a>
						</div>
					</div>
				)}
			</div>
			{showDescription && (
				<input
					value={formData.description}
					onChange={handleChange}
					className="my-2 h-8 w-full rounded border-b-2 border-gray-900 bg-neutral-200 p-2 text-xs outline-none placeholder:italic placeholder:text-gray-400"
					name="description"
					placeholder="Question description"
				/>
			)}
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
