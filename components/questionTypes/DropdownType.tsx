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
			<h1 className="bg-accent text-accent h-12 rounded-t border-2 border-gray-900 pl-2 pt-1 text-2xl font-bold">
				{id + 1}
			</h1>
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
