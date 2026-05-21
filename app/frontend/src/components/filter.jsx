import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Slider } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function FilterPanel({ filters, onChange, onClear }) {
  return (
    <div className="filter-panel">
      <div className="filter-header">
        <span className="filter-title">
          <FilterListIcon style={{ fontSize: 16 }} />
          Filters
        </span>
        <button className="filter-clear-btn" onClick={onClear}>
          Clear
        </button>
      </div>
      <div className="filter-section">
        <span className="filter-label">Job Type</span>
        <select
          value={filters.jobType}
          onChange={(e) => onChange("jobType", e.target.value)}
          className="filter-select"
        >
          <option value="all">All Types</option>
          <option value="permanent">Permanent</option>
          <option value="temporary">Temporary</option>
          <option value="internship">Internship</option>
          <option value="freelance">Freelance</option>
        </select>
      </div>

      <div className="filter-section">
        <span className="filter-label">Salary Max</span>
        <Slider
          value={filters.salaryMax}
          onChange={(_, v) => onChange("salaryMax", v)}
          min={0}
          max={150000}
          step={5000}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => `$${Math.round(v / 1000)}k`}
          sx={{
            color: "#7c3aed",
            "& .MuiSlider-rail": { background: "#1e293b" },
            "& .MuiSlider-thumb": { background: "#7c3aed" },
          }}
        />
        <div className="salary-range-values">
          <span>$0</span>
          <span>${Math.round(filters.salaryMax / 1000)}k</span>
        </div>
      </div>

      <div className="filter-section">
        <span className="filter-label">Work Type</span>
        <div className="checkbox-group">
          {["fullTime", "partTime", "remote", "hybrid"].map((type) => (
            <label key={type} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.workTypes.includes(type)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...filters.workTypes, type]
                    : filters.workTypes.filter((t) => t !== type);
                  onChange("workTypes", updated);
                }}
              />
              {type === "fullTime"
                ? "Full Time"
                : type === "partTime"
                  ? "Part Time"
                  : type === "remote"
                    ? "Remote"
                    : "Hybrid"}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}