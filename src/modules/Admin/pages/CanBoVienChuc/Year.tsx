import { useEffect, useState } from "react";
import LoadDanhSachNam from "../../../../api/Admin/Year/Year";

function DanhSachNam() {
  const [year, setYear] = useState<any[]>([]);

  useEffect(() => {
    LoadDanhSachNam().then((data) => {
      setYear(data); 
    });
  }, []);

  const headers = ["STT", "ID Năm", "Tên năm"];

  return (
    <div className="main-content">
      <div className="page-header">
        <h2 className="header-title">Basic Table</h2>
      </div>
      <div className="card">
        <div className="card-body">
          <h4>Bordered Table</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                {headers.map((h, idx) => (
                  <th key={idx}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {year.map((y, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{y.id_year}</td>
                  <td>{y.name_year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DanhSachNam;
