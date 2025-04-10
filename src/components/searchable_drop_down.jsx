import React, { useState, useRef, useEffect } from "react";

export default function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
}) {
  const [query, setQuery] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase())
  );

  // Keep query in sync with external value
  useEffect(() => {
    if (value && !query) {
      setQuery(value);
    }
  }, [value]);

  // ✅ After (always syncs with external value)
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  const handleSelect = (option) => {
    setQuery(option);
    onChange(option);
    setShowOptions(false);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowOptions(true);
        }}
        onFocus={() => setShowOptions(true)}
        onBlur={() => setTimeout(() => setShowOptions(false), 100)} // delay to allow item click
        placeholder={placeholder}
        className="w-full border  py-2 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {showOptions && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg max-h-60 overflow-auto mt-1 shadow-lg">
          {filteredOptions.length === 0 ? (
            <li className="px-4 py-2 text-gray-500">No results found</li>
          ) : (
            filteredOptions.map((option) => (
              <li
                key={option}
                onMouseDown={() => handleSelect(option)}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              >
                {option}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
