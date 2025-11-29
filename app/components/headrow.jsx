
export default function HeaderRow({ cols }) {
  return (
    <div className="flex">
      <div className="w-[50px]"></div>
      {cols.map((colLabel) => (
        <div
          key={colLabel}
          className="min-w-[120px] p-2 font-bold text-center border border-gray-400 bg-gray-100"
        >
          {colLabel}
        </div>
      ))}
    </div>
  );
}
