import { useEffect, useRef } from "react";

export default function CeoSelect2({ label, name, value, onChange, options }: any) {
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const $select = (window as any).$(selectRef.current!);

    // destroy trước khi attach
    if ($select.data("select2")) {
      $select.select2("destroy");
    }

    $select.select2({
      width: "100%",
      placeholder: "Chọn...",
      allowClear: true,
    });

    $select.on("change", function () {
      onChange({
        target: {
          name,
          value: (window as any).$(this).val(),
        },
      });
    });

    return () => {
      if ($select.data("select2")) {
        $select.select2("destroy");
      }
    };
  }, []);

  // cập nhật lại value khi React thay đổi
  useEffect(() => {
    (window as any).$(selectRef.current!).val(value).trigger("change.select2");
  }, [value]);

  return (
    <div>
      <label className="form-label ceo-label">{label}</label>
      <select ref={selectRef} name={name} className="form-control ceo-input">
        {options.map((opt: any, i: number) => (
          <option key={i} value={opt.value}>
            {opt.text}
          </option>
        ))}
      </select>
    </div>
  );
}
