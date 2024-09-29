import React from "react";

export default function UserAmount({ userCount }) {
  return (
    <div className="absolute bottom-10 right-10 p-3 border border-blue-500 text-center" span={12}>
      <h2 class="text-lg text-blue-600 text-2xl" > Active Users </h2>
      <div > {userCount}</div>
    </div>
  );
}
