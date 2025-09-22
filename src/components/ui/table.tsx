import React from "react";

type TableProps = {
  headers: string[];
  data: (string | number)[][];
  bordered?: boolean;
  hover?: boolean;
  small?: boolean;
};

const Table: React.FC<TableProps> = ({ headers, data, bordered, hover, small }) => {
  // build className theo props
  const classes = [
    "table",
    bordered ? "table-bordered" : "",
    hover ? "table-hover" : "",
    small ? "table-sm" : "",
  ]
    .join(" ")
    .trim();

  return (
    <div className="table-responsive">
      <table className={classes}>
        <thead>
          <tr>
            {headers.map((h, idx) => (
              <th key={idx} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rIdx) => (
            <tr key={rIdx}>
              {row.map((cell, cIdx) =>
                cIdx === 0 ? (
                  <th key={cIdx} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={cIdx}>{cell}</td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
