import React from "react";

export default function RoomInfo({ participants, actions }) {
  return (
    <div className="border border-blue-600 max-h-72 fixed top-10 right-0 m-6 p-4 bg-white bg-opacity-80 rounded-lg z-20 overflow-auto">
      <h3 className="text-xl font-semibold text-black mb-2 text-blue-600">Users</h3>
      <ul className="divide-y divide-gray-700 overflow-auto">
        {participants.map((participant, index) => (
          <li key={index} className="py-1">
            <span className="text-green-500">● </span>
            <span className="text-black">{participant}</span>
          </li>
        ))}
      </ul>
      <h3 className="text-xl font-semibold text-black mt-4 mb-2 overflow-auto text-blue-600">
        Info
      </h3>
      <ul className="divide-y divide-gray-700">
        {actions.map((action, index) => (
          <li key={index} className="py-1">
            <span className="text-black">{action}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
