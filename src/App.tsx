import { useEffect, useState } from "react";
import "./App.css";
import { CrowdstrikeTable } from "./components/CrowdstrikeTable";
import { CrowdstrikeData } from "./components/types";

function App() {
  const [data, setData] = useState<CrowdstrikeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = (): Promise<CrowdstrikeData[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            name: "smss.exe",
            device: "Mario",
            path: "\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe",
            status: "scheduled",
          },
          {
            name: "netsh.exe",
            device: "Luigi",
            path: "\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe",
            status: "available",
          },
          {
            name: "uxtheme.dll",
            device: "Peach",
            path: "\\Device\\HarddiskVolume1\\Windows\\System32\\uxtheme.dll",
            status: "available",
          },
          {
            name: "aries.sys",
            device: "Daisy",
            path: "\\Device\\HarddiskVolume1\\Windows\\System32\\aries.sys",
            status: "scheduled",
          },
          {
            name: "cryptbase.dll",
            device: "Yoshi",
            path: "\\Device\\HarddiskVolume1\\Windows\\System32\\cryptbase.dll",
            status: "scheduled",
          },
          {
            name: "7za.exe",
            device: "Toad",
            path: "\\Device\\HarddiskVolume1\\temp\\7za.exe",
            status: "scheduled",
          },
        ]);
      }, Math.random() * 2000);
    });
  };

  useEffect(() => {
    fetchData()
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return loading && data?.length === 0 ? (
    <div>Loading...</div>
  ) : (
    <CrowdstrikeTable
      data={data}
      columns={[
        { title: "Name", key: "name" },
        { title: "Device", key: "device" },
        { title: "Path", key: "path" },
        { title: "Status", key: "status" },
      ]}
    />
  );
}

export default App;
