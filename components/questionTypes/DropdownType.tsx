import SearchableDropdown from "../inputs/SearchableDropdown";
import { useState, useEffect } from "react";

export default function DropdownTypeQuestion({
	items,
	title,
	required,
	id,
	update,
}: {
	items: string[];
	title: string;
	required: boolean;
	id: number;
	update: (id: number, response: string) => void;
}) {
	const [selected, setSelected] = useState("");

	useEffect(() => {
		update(id, selected);
	}, [selected]);

	return (
		<div className="my-6 rounded">
			<h1 className="h-10 rounded-t bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pl-2 pt-1 text-2xl font-bold text-neutral-50">
				{id + 1}
			</h1>
			<div className="border-2 border-t-0 border-gray-900 p-4">
				<h2 className="text-lg">{title}</h2>
				<SearchableDropdown
					options={items}
					selectedVal={selected}
					handleChange={(val) => setSelected(val)}
				/>
			</div>
		</div>
	);
}
