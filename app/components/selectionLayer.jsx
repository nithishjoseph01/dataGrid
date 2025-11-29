export default function SelectionLayer({ selection, cellRefs }) {
    const [rect, setRect] = useState(null);

    useLayoutEffect(() => {
        if (!selection || !cellRefs.current) return;

        const { anchor, focus } = selection;
        const { rmin, rmax, cmin, cmax } = normalizeRange(
            anchor.r,
            anchor.c,
            focus.r,
            focus.c
        );
        const firstCell = cellRefs.current[`${rmin}-${cmin}`];
        const lastCell = cellRefs.current[`${rmax}-${cmax}`];

        if (!firstCell || !lastCell) return;

        const firstRect = firstCell.getBoundingClientRect();
        const lastRect = lastCell.getBoundingClientRect();
        const gridRect = firstCell.closest(".grid-container").getBoundingClientRect();

        setRect({
            top: firstRect.top - gridRect.top,
            left: firstRect.left - gridRect.left,
            width: lastRect.right - firstRect.left,
            height: lastRect.bottom - firstRect.top,
        });
    }, [selection, cellRefs]);

    if (!rect) return null;

    return (
        <div
            className="absolute pointer-events-none border-2 border-blue-600"
            style={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
            }}
        />
    );
}
