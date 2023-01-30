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
		<div className="">
			<div className="">
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
						className="w-36 rounded bg-slate-600 text-white"
					/>
				</div>
				<div className={`${isOpen ? "inline" : "hidden"}`}></div>
			</div>

			<div
				className={`${
					isOpen ? "absolute" : "hidden"
				} w-36 bg-slate-600 text-white`}
			>
				{filter(options).map((option: string, index: number) => {
					if (index < 4)
						return (
							<div
								onClick={() => selectOption(option)}
								className={`${
									option === selectedVal ? "bg-slate-500" : ""
								} hover:bg-slate-300`}
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
