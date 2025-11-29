import { render, fireEvent, screen } from "@testing-library/react";
import DataGrid from "../app/components/Datagrid";

describe("DataGrid minimal test", () => {
  test("edit a cell and add row/column", () => {
    const { container } = render(<DataGrid />);
    const firstCell = container.querySelector('textarea') || container.querySelector('pre');
    expect(firstCell).toBeInTheDocument();
    const addCol = screen.getByText("Add Column");
    const addRow = screen.getByText("Add Row");
    fireEvent.click(addCol);
    fireEvent.click(addRow);

    const cells = container.querySelectorAll('div[tabindex="0"]');
    expect(cells.length).toBeGreaterThan(25);
  });

  test("copy, cut, paste (simplified)", () => {
    const { container } = render(<DataGrid />);
    
    const cells = container.querySelectorAll('div[tabindex="0"]');
    expect(cells.length).toBeGreaterThan(0);
    fireEvent.copy(window);
    fireEvent.cut(window);
    fireEvent.paste(window);
  });

  test("shift selection works (simplified)", () => {
    const { container } = render(<DataGrid />);
    const cells = container.querySelectorAll('div[tabindex="0"]');
    expect(cells.length).toBeGreaterThan(1);

    fireEvent.mouseDown(cells[0], { shiftKey: false });
    fireEvent.mouseEnter(cells[1]);
    const selected = Array.from(cells).filter(cell =>
      cell.className.includes("border")
    );
    expect(selected.length).toBeGreaterThan(0);
  });
});
