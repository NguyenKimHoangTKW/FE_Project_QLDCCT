import Table from "../../../../components/ui/table";
function TableDemo() {
  const headers = ["#", "First", "Last", "Handle"];
  const data = [
    [1, "Mark", "Otto", "@mdo"],
    [2, "Jacob", "Thornton", "@fat"],
    [3, "Larry", "the Bird", "@twitter"],
  ];

  return (
    <div className="main-content">
      <div className="page-header">
        <h2 className="header-title">Basic Table</h2>
      </div>
      <div className="card">
        <div className="card-body">
          <h4>Bordered Table</h4>
          <Table headers={headers} data={data} bordered />
        </div>
      </div>
    </div>
  );
}

export default TableDemo;
