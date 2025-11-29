"use client";

import React, { useState, useRef, useEffect } from "react";
import Cell from "./cell";
import { normalizeRange } from "../utils/gridUtils";

export default function DataGrid() {

  const [grid, setGrid] = useState(
    Array.from({ length: 5 }, () => Array(5).fill(""))
  );

  const [focus, setFocus] = useState({ row: 0, col: 0 });

  const [selection, setSelection] = useState({
    anchor: { row: 0, col: 0 },
    focus: { row: 0, col: 0 },
  });

  const [tempValue, setTempValue] = useState("");
  const [clipboard, setClipboard] = useState([]);

  const mouseDownRef = useRef(false);

  const numRows = grid.length;
  const numCols = grid[0].length;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const handleMouseDown = (row, col, shiftKey) => {
    mouseDownRef.current = true;
    setFocus({ row, col });
    setTempValue(grid[row][col]);

    if (shiftKey) {
      setSelection((prev) => ({ anchor: prev.anchor, focus: { row, col } }));
    } else {
      setSelection({ anchor: { row, col }, focus: { row, col } });
    }
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseDownRef.current) return;
    setSelection((prev) => ({ anchor: prev.anchor, focus: { row, col } }));
  };

  const handleMouseUp = () => {
    mouseDownRef.current = false;
  };
  const commit = () => {
    setGrid((prevGrid) => {
      const updatedGrid = prevGrid.map((r) => [...r]);
      updatedGrid[focus.row][focus.col] = tempValue;
      return updatedGrid;
    });
  };

  const cancel = () => {
    setTempValue(grid[focus.row][focus.col]);
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      const { row, col } = focus;
      let nextRow = row;
      let nextCol = col;

      if (e.key === "ArrowUp") nextRow = clamp(row - 1, 0, numRows - 1);
      if (e.key === "ArrowDown") nextRow = clamp(row + 1, 0, numRows - 1);
      if (e.key === "ArrowLeft") nextCol = clamp(col - 1, 0, numCols - 1);
      if (e.key === "ArrowRight") nextCol = clamp(col + 1, 0, numCols - 1);

      if (e.key === "Tab") {
        e.preventDefault();
        nextCol = e.shiftKey
          ? clamp(col - 1, 0, numCols - 1)
          : clamp(col + 1, 0, numCols - 1);
      }

      if (e.key === "Enter") {
        e.preventDefault();
        commit();
        nextRow = clamp(row + 1, 0, numRows - 1);
      }

      if (e.key === "Escape") {
        cancel();
        return;
      }

      if (nextRow !== row || nextCol !== col) {
        setTempValue(grid[nextRow][nextCol]);
        setFocus({ row: nextRow, col: nextCol });
        setSelection({ anchor: { row: nextRow, col: nextCol }, focus: { row: nextRow, col: nextCol } });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focus, grid, numRows, numCols]);
  useEffect(() => {
    const handleCopy = (e) => {
      e.preventDefault();
      const { rmin, rmax, cmin, cmax } = normalizeRange(
        selection.anchor.row,
        selection.anchor.col,
        selection.focus.row,
        selection.focus.col
      );

      const copiedData = [];
      for (let r = rmin; r <= rmax; r++) {
        copiedData.push(grid[r].slice(cmin, cmax + 1));
      }

      setClipboard(copiedData);
    };

    const handleCut = (e) => {
      e.preventDefault();
      const { rmin, rmax, cmin, cmax } = normalizeRange(
        selection.anchor.row,
        selection.anchor.col,
        selection.focus.row,
        selection.focus.col
      );

      const cutData = [];
      const updatedGrid = grid.map((r) => [...r]);

      for (let r = rmin; r <= rmax; r++) {
        const rowData = [];
        for (let c = cmin; c <= cmax; c++) {
          rowData.push(updatedGrid[r][c]);
          updatedGrid[r][c] = "";
        }
        cutData.push(rowData);
      }

      setClipboard(cutData);
      setGrid(updatedGrid);
    };

    const handlePaste = (e) => {
      e.preventDefault();
      if (!clipboard.length) return;

      const { row, col } = focus;
      const updatedGrid = grid.map((r) => [...r]);

      while (updatedGrid.length < row + clipboard.length) {
        updatedGrid.push(Array(updatedGrid[0].length).fill(""));
      }
      while (updatedGrid[0].length < col + clipboard[0].length) {
        updatedGrid.forEach((r) => r.push(""));
      }
      for (let r = 0; r < clipboard.length; r++) {
        for (let c = 0; c < clipboard[r].length; c++) {
          updatedGrid[row + r][col + c] = clipboard[r][c];
        }
      }

      setGrid(updatedGrid);
      setTempValue(updatedGrid[row][col]);
    };

    window.addEventListener("copy", handleCopy);
    window.addEventListener("cut", handleCut);
    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("copy", handleCopy);
      window.removeEventListener("cut", handleCut);
      window.removeEventListener("paste", handlePaste);
    };
  }, [grid, selection, focus, clipboard]);

  const isSelected = (row, col) => {
    const { rmin, rmax, cmin, cmax } = normalizeRange(
      selection.anchor.row,
      selection.anchor.col,
      selection.focus.row,
      selection.focus.col
    );
    return row >= rmin && row <= rmax && col >= cmin && col <= cmax;
  };

  useEffect(() => {
    localStorage.setItem("datagrid", JSON.stringify(grid));
  }, [grid]);

  useEffect(() => {
    const savedGrid = localStorage.getItem("datagrid");
    if (savedGrid) setGrid(JSON.parse(savedGrid));
  }, []);

  return (
    <div className="space-y-4" onMouseUp={handleMouseUp}>
      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setGrid((prev) => prev.map((r) => [...r, ""]))}
        >
          Add Column
        </button>

        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => setGrid((prev) => [...prev, Array(numCols).fill("")])}
        >
          Add Row
        </button>
      </div>

      <div className="border border-gray-300 inline-block rounded shadow-sm p-2 select-none overflow-auto">
        <div className="grid" style={{ gridTemplateColumns: `80px repeat(${numCols}, auto)` }}>
          <div className="bg-gray-200 font-bold border border-gray-300 flex items-center justify-center">#</div>
          {Array.from({ length: numCols }).map((_, c) => (
            <div key={c} className="bg-gray-200 font-bold border border-gray-300 flex items-center justify-center">
              {String.fromCharCode(65 + c)}
            </div>
          ))}
          {grid.map((row, r) => (
            <React.Fragment key={r}>
              <div className="bg-gray-100 border border-gray-300 flex items-center justify-center">{r + 1}</div>

              {row.map((cell, c) => (
                <Cell
                  key={`${r}-${c}`}
                  value={cell}
                  focused={focus.row === r && focus.col === c}
                  tempValue={focus.row === r && focus.col === c ? tempValue : undefined}
                  selected={isSelected(r, c)}
                  onTempChange={(v) => setTempValue(v)}
                  onCommit={commit}
                  onCancel={cancel}
                  onMouseDown={(e) => handleMouseDown(r, c, e.shiftKey)}
                  onMouseEnter={() => handleMouseEnter(r, c)}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
