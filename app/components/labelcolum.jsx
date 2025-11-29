export default function LabelColumn({ rows }) {
  return (
    <div>
      {rows.map((rowLabel) => (
        <div
          key={r}
          className="w-[50px] h-full p-2 border border-gray-300 text-center bg-gray-50 font-bold"
        >
          {rowLabel}
        </div>
      ))}
    </div>
  );
}
