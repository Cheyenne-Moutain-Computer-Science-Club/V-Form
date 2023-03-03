import SearchableDropdown from "../inputs/SearchableDropdown";
import { useState, useEffect } from "react";

export default function DropdownTypeQuestion({
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
	update: (id: number, response: string) => void;
	description: string;
	placeholder: string;
}) {
	const [selected, setSelected] = useState("");

	useEffect(() => {
		update(id, selected);
	}, [selected]);

	return (
		<div className="my-8">
			<div className="bg-accent flex h-12 items-center justify-between rounded-t border-2 border-gray-900 px-3">
				<h1 className="text-2xl font-bold text-gray-900">{id + 1}</h1>
				{required && (
					<svg
						aria-hidden="true"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
					>
						<path
							d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				)}
			</div>
			<div className="rounded-b border-2 border-t-0 border-gray-900 p-4">
				<h2 className="text-lg">{title}</h2>
				<h3 className="text-xs">{description}</h3>
				<SearchableDropdown
					options={items}
					selectedVal={selected}
					handleChange={(val) => {
						setSelected(val);
					}}
					placeholder={placeholder}
				/>
			</div>
		</div>
	);
}
