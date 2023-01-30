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
		<div className="m-6 rounded dark:bg-stone-700">
			<h1 className="h-8 rounded-t bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pl-2 text-2xl font-bold text-white">
				{id}
			</h1>
			<h2>{title}</h2>
			<SearchableDropdown
				options={items}
				selectedVal={selected}
				handleChange={(val) => setSelected(val)}
			/>
		</div>
	);
}
