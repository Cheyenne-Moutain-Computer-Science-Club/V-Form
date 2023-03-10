import { useState, useEffect } from "react";

export default function EditMultipleChoiceTypeQuestion({
	items,
	title,
	required,
	id,
	update,
	description,
}: {
	items: string[];
	title: string;
	required: boolean;
	id: number;
	update: (id: number, response: string) => void;
	description: string;
}) {
	const [selected, setSelected] = useState("");

	useEffect(() => {
		update(id, selected);
	}, [selected]);

	function onChangeValue(e: any) {
		setSelected(e.target.value);
	}

	return (
		<div className="my-8">
			<h1 className="bg-accent text-accent h-12 rounded-t border-2 border-gray-900 pl-2 pt-1 text-2xl font-bold">
				{id + 1}
			</h1>
			<div className="rounded-b border-2 border-t-0 border-gray-900 p-4">
				<h2 className="text-lg">{title}</h2>
				<h3 className="text-xs">{description}</h3>
				<div onChange={onChangeValue} className="py-2">
					{items.map((item, i) => {
						return (
							<div key={i}>
								<input
									type="radio"
									value={item}
									name={title}
									className="checked:bg-accent h-4 w-4 appearance-none rounded-full border-2 border-gray-900 bg-neutral-50 focus:ring-0"
								/>{" "}
								{item}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
