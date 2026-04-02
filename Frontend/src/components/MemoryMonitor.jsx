import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // your backend URL

const MemoryMonitor = () => {
  const [memory, setMemory] = useState({
    total_mem: "0 GB",
    used_mem: "0 GB",
    free_mem: "0 GB",
    used_percentage: "0%",
  });

  useEffect(() => {
    // Listen to memory updates from server
    socket.on("memoryUpdate", (data) => {
      setMemory(data);
    });

    return () => {
      socket.off("memoryUpdate");
    };
  }, []);

  // Convert percentage string to number
  const percent = parseFloat(memory.used_percentage);

  // Decide bar color
  let barColor = "bg-green-500";
  if (percent > 80) barColor = "bg-red-500";
  else if (percent > 50) barColor = "bg-yellow-500";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">💻 Memory Monitor</h1>

      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-lg">
        <p>Total Memory: {memory.total_mem}</p>
        <p>Used Memory: {memory.used_mem}</p>
        <p>Free Memory: {memory.free_mem}</p>
        <p>Usage: {memory.used_percentage}</p>

        <div className="w-full h-6 bg-gray-700 rounded-full mt-4 overflow-hidden">
          <div
            className={`${barColor} h-full transition-all duration-500`}
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MemoryMonitor;