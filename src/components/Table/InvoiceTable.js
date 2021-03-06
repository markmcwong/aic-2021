import React from "react";
import Table from "react-bootstrap/Table";
import "./Table.css";
import { IoDownloadOutline } from "react-icons/io5";
import { Storage } from "aws-amplify";

const InvoiceTable = ({ data, type = "Not sales", navigateCallback }) => {
  return (
    <Table responsive="sm" hover className="w-full custom-table">
      <thead className="py-2 border-1 theme-colour">
        <tr>
          <th className="w-3/5 pl-8 text-left" style={{ paddingLeft: "25px" }}>
            Invoice
          </th>
          <th>Amount Found</th>
          <th>Download</th>
        </tr>
      </thead>
      <tbody className="border-1 theme-colour">
        {data &&
          data.map((item, index) => (
            <tr>
              <td className="w-3/5 text-left" style={{ paddingLeft: "25px" }}>
                {item.invoiceNumber}
              </td>
              <td>{item.amount}</td>
              <td>
                <IoDownloadOutline
                  className="cursor-pointer"
                  color="#00386B"
                  size="24"
                  onClick={async () => {
                    const signedURL = await Storage.get(
                      item.downloadURL.substring(7, item.downloadURL.length)
                    );
                    window.open(signedURL);
                  }}
                />
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};

export default InvoiceTable;
