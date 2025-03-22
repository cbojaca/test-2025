import styled from "styled-components";
import { CrowdstrikeColumns, CrowdstrikeData } from "./types";
import { useEffect, useRef } from "react";
import downloadIcon from "../assets/download_icon.svg";
import { useCrowdstrikeTable } from "../hooks/useCrowdstrikeTable";

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const DownloadImage = styled.img`
  width: 20px;
  height: 20px;
  padding: 0px 10px;
`;

const AvailableCircle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: green;
`;

const DownloadButton = styled.button`
  background-color: inherit;
  color: black;
  border: none;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  margin: 4px
  &:hover {
    border: 2px solid #cfcfcf;
  }

    &:disabled {
        color: gray;
        cursor: not-allowed;
    }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  font-size: 16px;

  tbody {
    border: 1px solid #cfcfcf;
  }

  tr {
    cursor: pointer;
    &:hover {
      background-color: rgb(235, 235, 235);
    }
  }
`;

const TableDownloadHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const StyledTh = styled.th`
  background-color: #f4f4f4;
  padding: 12px;
  border: 1px solid #cfcfcf;
  text-align: left;
`;

const StyledTd = styled.td`
  padding: 12px;
  border: 1px solid #cfcfcf;
  text-align: left;
`;

const StatusContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 8px;
`;

const CheckboxContainer = styled.td`
  padding: 8px;
  text-align: center;
  border: 1px solid #cfcfcf;
`;

const NoDataRow = styled.tr`
  td {
    text-align: center;
    font-weight: bold;
    color: gray;
    padding: 12px;
  }
`;

type CrowdstriketableProps = {
  data: CrowdstrikeData[];
  columns: CrowdstrikeColumns[];
};

export function CrowdstrikeTable({ data, columns }: CrowdstriketableProps) {
  const checkboxRef = useRef<HTMLInputElement>(null);

  const {
    handleCheckboxChange,
    handleSelectAll,
    isDownloadAvailable,
    selectedRows,
    selectedRowsCount,
    onHandleDownload,
  } = useCrowdstrikeTable({ data });

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate =
        selectedRows.size > 0 && selectedRows.size < data.length;
    }
  }, [data, selectedRows.size]);

  return (
    <TableContainer>
      <TableDownloadHeader>
        <DownloadButton
          disabled={!isDownloadAvailable}
          onClick={onHandleDownload}
        >
          <DownloadImage src={downloadIcon} alt="Download" />
          Dowload Selected
        </DownloadButton>
      </TableDownloadHeader>
      <StyledTable>
        <thead>
          <tr>
            <StyledTh>
              <input
                ref={checkboxRef}
                type="checkbox"
                checked={selectedRows.size === data.length && data.length > 0}
                onChange={handleSelectAll}
              />
              <span>
                Selected {selectedRowsCount > 0 ? selectedRowsCount : ""}
              </span>
            </StyledTh>
            {columns.map((column) => (
              <StyledTh key={column.key}>{column.title}</StyledTh>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <CheckboxContainer>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(rowIndex)}
                    onChange={() => handleCheckboxChange(rowIndex)}
                  />
                </CheckboxContainer>

                <StyledTd>{row.name}</StyledTd>
                <StyledTd>{row.device}</StyledTd>
                <StyledTd>{row.path}</StyledTd>
                <StyledTd>
                  <StatusContainer>
                    {row.status === "available" && <AvailableCircle />}
                    {row.status}
                  </StatusContainer>
                </StyledTd>
              </tr>
            ))
          ) : (
            <NoDataRow>
              <td colSpan={columns.length + 1}>No data available</td>
            </NoDataRow>
          )}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
}
