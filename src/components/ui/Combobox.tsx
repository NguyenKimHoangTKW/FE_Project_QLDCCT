import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";

export default function CeoCombobox({
  label,
  value,
  onChange,
  options,
  placeholder = "Tìm kiếm...",
}: any) {
  const [query, setQuery] = useState("");

  const filtered =
    query === ""
      ? options
      : options.filter((item: any) =>
          item.text.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div>
      <label className="form-label ceo-label">{label}</label>

      <Combobox value={value} onChange={onChange}>
        <div className="relative">
          <Combobox.Input
            className="form-control ceo-input"
            placeholder={placeholder}
            displayValue={(item: any) => item?.text || ""}
            onChange={(event) => setQuery(event.target.value)}
          />

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg z-50 border">
              {filtered.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">Không có dữ liệu</div>
              ) : (
                filtered.map((item: any, idx: number) => (
                  <Combobox.Option
                    key={idx}
                    value={item}
                    className={({ active }) =>
                      `cursor-pointer select-none px-4 py-2 ${
                        active ? "bg-primary text-white" : "text-gray-700"
                      }`
                    }
                  >
                    {item.text}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
