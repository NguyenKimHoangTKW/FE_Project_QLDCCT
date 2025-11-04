import React, { useEffect, useRef } from "react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";

interface Props {
  binding: string;
  onChange?: (data: any) => void;
  readOnly?: boolean;
}

export default function OBEStructuredTable({
  binding,
  onChange,
  readOnly = false,
}: Props) {
  const tableRef = useRef<HTMLDivElement>(null);
  const hotRef = useRef<Handsontable | null>(null);

  useEffect(() => {
    const columns = getColumnsByBinding(binding);

    if (!tableRef.current) return;

    // ✅ Tạo bảng có sẵn 3 hàng và 5 cột trống ban đầu
    hotRef.current = new Handsontable(tableRef.current, {
      data: Array(3).fill(Array(columns.length).fill("")),
      colHeaders: columns.map((c) => c.header),
      columns,
      rowHeaders: true,
      readOnly,
      minRows: 3,
      minCols: columns.length,
      stretchH: "all",
      height: "auto",
      width: "100%",
      contextMenu: !readOnly,
      manualColumnResize: true,
      manualRowResize: true,
      licenseKey: "non-commercial-and-evaluation",
      afterChange: () => {
        if (!readOnly && hotRef.current && typeof onChange === "function") {
          onChange(hotRef.current.getData());
        }
      },
    });

    return () => {
      if (hotRef.current) hotRef.current.destroy();
    };
  }, [binding, readOnly]);

  return (
    <div
      ref={tableRef}
      style={{
        width: "100%",
        overflowX: "auto",
        marginTop: "10px",
        border: "1px solid #ccc",
      }}
    />
  );
}

// Cấu hình cột theo biểu mẫu
function getColumnsByBinding(binding: string) {
  const clean = binding.toUpperCase();

  if (clean.includes("CO")) {
    return [
      { header: "Mã CO", data: "code", type: "text" },
      { header: "Mục tiêu học phần", data: "description", type: "text" },
      {
        header: "Loại năng lực",
        data: "type",
        type: "dropdown",
        source: ["Kiến thức", "Kỹ năng", "Thái độ"],
      },
    ];
  }
  if (clean.includes("CLO")) {
    return [
      { header: "Mã CLO", data: "code", type: "text" },
      { header: "Mô tả CLO", data: "description", type: "text" },
      {
        header: "Mức Bloom",
        data: "bloom",
        type: "dropdown",
        source: [
          "Nhớ",
          "Hiểu",
          "Vận dụng",
          "Phân tích",
          "Đánh giá",
          "Sáng tạo",
        ],
      },
    ];
  }
  if (clean.includes("PLO")) {
    return [
      { header: "CLO", data: "clo", type: "text" },
      { header: "PLO/PI", data: "pi", type: "text" },
      {
        header: "Mức độ đóng góp",
        data: "level",
        type: "dropdown",
        source: ["I", "R", "M", "A"],
      },
    ];
  }

  return [{ header: "Cột", data: "col", type: "text" }];
}
