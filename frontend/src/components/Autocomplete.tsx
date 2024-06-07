import React, { useState } from "react";

interface AutocompleteProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  label,
  value,
  onChange,
}) => {
  const [options, setOptions] = useState<{ id: string; description: string }[]>(
    []
  );
  const [inputValue, setInputValue] = useState(value);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchOptions = async (
    pattern: string,
    pageIndex: number,
    opts?: Array<Record<string, string>>
  ) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URI
        }/api/mccAliases?pattern=${pattern}&pageIndex=${pageIndex}`
      ).then((ok) => ok.json());
      const { items, count } = response;
      if (opts) {
        setOptions([...opts, ...items]);
      } else {
        setOptions([...items]);
      }
      setHasMore(items.length > 0 && options.length < count);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setOptions([]);
    setPageIndex(0);
    await fetchOptions(value, 0);
  };

  const handleOptionClick = (option: { id: string; description: string }) => {
    setInputValue(option.description);
    setOptions([]);
    onChange(option.id);
  };

  const loadMoreOptions = () => {
    if (hasMore && !loading) {
      setPageIndex(pageIndex + 1);
      fetchOptions(inputValue, pageIndex, options);
    }
  };

  return (
    <div className="mb-4 relative">
      <label htmlFor="autocomplete" className="block text-gray-700">
        {label}
      </label>
      <input
        type="text"
        id="autocomplete"
        name="autocomplete"
        value={inputValue}
        onChange={handleInputChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
      />

      {options.length > 0 && (
        <ul
          className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
          onScroll={(e) => {
            const bottom =
              e.currentTarget.scrollHeight ===
              e.currentTarget.scrollTop + e.currentTarget.clientHeight;
            if (bottom) loadMoreOptions();
          }}
        >
          {options.map((option, idx) => (
            <li
              key={`opt-${idx}`}
              onClick={() => handleOptionClick(option)}
              className="cursor-pointer px-4 py-2 hover:bg-gray-200"
            >
              {option.description}
            </li>
          ))}
          {loading && <li className="px-4 py-2">Loading...</li>}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
