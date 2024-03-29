import { useState, useEffect, useRef } from "react";

export default function SearchableDropdown({
	options,
	selectedVal,
	handleChange,
	placeholder,
}: {
	options: string[];
	selectedVal: string;
	handleChange: (val: string) => void;
	placeholder: string;
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

	const drop = (e: any) => {
		// if (e.target.value.length > 0) {
		setIsOpen(true);
		// } else {
		// 	setIsOpen(false);
		// }
	};

	return (
		<div className="w-full py-2">
			<input
				ref={inputRef}
				type="text"
				value={getDisplayValue()}
				name="searchTerm"
				onChange={(e) => {
					setQuery(e.target.value);
					handleChange("");
					drop(e);
				}}
				onClick={toggle}
				placeholder={placeholder}
				className={`h-12 w-full rounded border-b-2 border-neutral-900 bg-neutral-200 p-2 text-gray-900 outline-none placeholder:italic placeholder:text-gray-400 md:w-96`}
			/>

			{isOpen && (
				<div
					className={
						"absolute max-h-48 w-96 overflow-auto rounded border-2 border-t-0 border-neutral-800 bg-neutral-50 text-gray-900"
					}
				>
					{filter(options).map((option: string, index: number) => {
						return (
							<div
								onClick={() => selectOption(option)}
								className={`${
									option == selectedVal
										? "bg-gray-900 font-semibold text-neutral-50"
										: ""
								} px-2 py-2 hover:bg-gray-900 hover:font-semibold hover:text-neutral-50`}
								key={index}
							>
								{option}
							</div>
						);
					})}
					{filter(options).length === 0 && (
						<div className="bg-gray-200 px-2 py-2 text-gray-400">
							No options found
						</div>
					)}
				</div>
			)}
		</div>
	);
}
