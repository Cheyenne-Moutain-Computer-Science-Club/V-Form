import { useState, useEffect, useRef } from "react";

export default function SearchableDropdown({
	options,
	selectedVal,
	handleChange,
}: {
	options: string[];
	selectedVal: string;
	handleChange: (val: string) => void;
}) {
	const [query, setQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const inputRef = useRef(null);

	useEffect(() => {
		document.addEventListener("click", toggle);
		return () => document.removeEventListener("click", toggle);
	}, []);

	const selectOption = (option: string) => {
		setQuery(() => option);
		handleChange(option);
		setIsOpen((isOpen) => !isOpen);
	};

	// FIX TYPE!!!!!!
	function toggle(e: any) {
		setIsOpen(e && e.target === inputRef.current);
	}

	const getDisplayValue = () => {
		if (query) return query;
		if (selectedVal) return selectedVal;

		return "";
	};

	const filter = (options: string[]) => {
		return options.filter(
			(option) => option.toLowerCase().indexOf(query.toLowerCase()) > -1
		);
	};

	return (
		<div className="w-full py-2">
			<div className="">
				<input
					ref={inputRef}
					type="text"
					value={getDisplayValue()}
					name="searchTerm"
					onChange={(e) => {
						setQuery(e.target.value);
						handleChange("");
					}}
					onClick={toggle}
					placeholder="Enter a name"
					className="h-8 w-80 rounded border-2 border-neutral-800 bg-neutral-100 p-2 text-gray-900 outline-none placeholder:italic placeholder:text-gray-400"
				/>
			</div>

			<div
				className={`${
					isOpen ? "absolute" : "hidden"
				} max-h-48 w-80 overflow-auto rounded border-2 border-neutral-800 bg-neutral-100 text-gray-900`}
			>
				{filter(options).map((option: string, index: number) => {
					return (
						<div
							onClick={() => selectOption(option)}
							className={`${
								option == selectedVal
									? "bg-gradient-to-r text-neutral-100"
									: ""
							} border-red from-indigo-500 via-purple-500 to-pink-500 px-2 py-1 hover:bg-gradient-to-r hover:text-neutral-100`}
							key={index}
						>
							{option}
						</div>
					);
				})}
			</div>
		</div>
	);
}
