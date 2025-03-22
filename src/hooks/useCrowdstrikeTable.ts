import { useState, useMemo, useCallback } from "react";
import { CrowdstrikeData } from "../components/types";


type UseCrowdstrikeTableProps = {
    data: CrowdstrikeData[];
};

export function useCrowdstrikeTable({data}: UseCrowdstrikeTableProps
) {
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
      const handleCheckboxChange = (rowIndex: number) => {
        setSelectedRows((prevSelectedRows) => {
          const newSelectedRows = new Set(prevSelectedRows);
          if (newSelectedRows.has(rowIndex)) {
            newSelectedRows.delete(rowIndex);
          } else {
            newSelectedRows.add(rowIndex);
          }
          return newSelectedRows;
        });
      };

      const handleSelectAll = () => {
        if (selectedRows.size === data.length) {
          selectedRows.clear();
          setSelectedRows(new Set());
        } else {
          data.forEach((_, index) => setSelectedRows((prevSelectedRows) => new Set(prevSelectedRows).add(index)));
        }
      };

      const filteredData = useMemo(() => {
        return data.filter((_, rowIndex) => selectedRows.has(rowIndex));
      }, [data, selectedRows]);
      const selectedRowsCount = useMemo(() => selectedRows.size, [selectedRows]);
      const hasAvailableStatus = filteredData.some(
        (row) => row.status === "available"
      );

      const isDownloadAvailable = selectedRowsCount > 0 && hasAvailableStatus;


      const onHandleDownload = useCallback(() => {
        const selectedPaths = filteredData.map((row) => row.path).join("\n");
        alert(`Downloading: ${selectedPaths}`);
      }, [filteredData]);

      return {selectedRows, handleCheckboxChange, handleSelectAll, filteredData, selectedRowsCount, hasAvailableStatus, isDownloadAvailable, onHandleDownload};
}