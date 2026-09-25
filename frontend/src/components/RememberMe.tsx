import type React from "react";

export default function RememberMe({value,onChange}:{value:boolean,onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void}) {
  return (
    <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={value}
                onChange={onChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <span>Remember me</span>
            </label>
          </div>
  )
}
