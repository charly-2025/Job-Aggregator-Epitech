import { useState, useEffect, useCallback, useRef } from "react";
import { Slider } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import "./SearchJobs.css";

const BASE_URL = "http://localhost:3001";

function formatSalary(salary) {
  if (!salary) return "Non précisé";
  return `$${Number(salary).toLocaleString()}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}


function JobCard({ job, onSave, initialLiked = false }) {
  const [saved, setSaved] = useState(initialLiked);
  const cardRef = useRef(null);

  useEffect(() => {
    setSaved(initialLiked);
  }, [initialLiked]);
  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty("--mx", `${x}%`);
    cardRef.current.style.setProperty("--my", `${y}%`);
  };

  const handleSave = async () => {
    try {
      await fetch(`${BASE_URL}/api/offers/handleOfferLike/${job.offer_id}`, {
        method: "PUT",
        credentials: "include",
      });
      setSaved((p) => !p);
      if (onSave) onSave(job);
    } catch (err) {
      console.error(err);
    }
  };

  const displayedSkills = (job.skills || []).slice(0, 5);
  const extraCount = (job.skills || []).length - 5;

  return (
    <div className="job-card" ref={cardRef} onMouseMove={handleMouseMove}>
      <div className="job-card-header">
        <div className="job-card-info">
          <div className="job-title-row">
            <h3 className="job-title">{job.title}</h3>
          </div>
          <p className="job-company">{job.company_name}</p>
        </div>
        <button
          className={`save-btn${saved ? " saved" : ""}`}
          onClick={handleSave}
          aria-label={saved ? "Retirer" : "Sauvegarder"}
        >
          {saved ? (
            <FavoriteIcon style={{ fontSize: 18 }} />
          ) : (
            <FavoriteBorderIcon style={{ fontSize: 18 }} />
          )}
        </button>
      </div>

      <div className="job-meta">
        {job.location && (
          <span className="meta-item">
            <LocationOnOutlinedIcon />
            {job.location}
          </span>
        )}
        {job.job_type && (
          <span className="meta-item">
            <BusinessCenterOutlinedIcon />
            {job.job_type}
          </span>
        )}
        {job.salary && (
          <span className="meta-item">
            <AttachMoneyOutlinedIcon />
            {formatSalary(job.salary)}
          </span>
        )}
        {job.published_at && (
          <span className="meta-item">
            <AccessTimeOutlinedIcon />
            {formatDate(job.published_at)}
          </span>
        )}
      </div>

      {job.about && <p className="job-description">{job.about}</p>}

      {displayedSkills.length > 0 && (
        <div className="skill-chips">
          {displayedSkills.map((skill) => (
            <span key={skill} className="skill-chip">
              {skill}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="skill-chip skill-chip-extra">
              +{extraCount} more
            </span>
          )}
        </div>
      )}

      <div className="job-card-actions">
        <button className="btn-details">View Details</button>
        <a
          href={job.source_url || "#"}
          target="_blank"
          rel="noreferrer"
          className="btn-apply"
        >
          Apply Now
        </a>
      </div>
    </div>
  );
}

function FilterPanel({ filters, onChange, onClear }) {
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
          <option value="permanent">CDI</option>
          <option value="temporary">CDD</option>
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
                {type === "fullTime" ? "Full Time"
                  : type === "partTime" ? "Part Time"
                  : type === "remote" ? "Remote"
                  : "Hybrid"}
              </label>
            ))}
        </div>
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="pagination">
      <button
        className="page-btn"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        ‹
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
        .reduce((acc, p, idx, arr) => {
          if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
          acc.push(p);
          return acc;
        }, [])
        .map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="page-dots">…</span>
          ) : (
            <button
              key={p}
              className={`page-btn${p === page ? " active" : ""}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}
      <button
        className="page-btn"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        ›
      </button>
    </div>
  );
}

export default function SearchJobs({ onSave }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("relevant");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [likedIds, setLikedIds] = useState(new Set());
  const [filters, setFilters] = useState({
  jobType: "all",
  salaryMax: 150000,
  workTypes: [],
});
  const isFirstRender = useRef(true);
  const debounceRef = useRef(null);
  const fetchLikedOffers = useCallback(async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/users/offersUserLikes`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to fetch liked offers");

      const data = await res.json();

      setLikedIds(
        new Set(
          Array.isArray(data)
            ? data.map((job) => job.offer_id)
            : []
        )
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchLikedOffers();
  }, [fetchLikedOffers]);

  const fetchOffers = useCallback(async (currentPage = 1) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `${BASE_URL}/api/offers/allOffers?page=${currentPage}&limit=10`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setJobs(json.data || []);
      setTotalPages(json.totalPages || 1);
      setTotal(json.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSearch = useCallback(async (text, currentPage = 1) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `${BASE_URL}/api/offers/search/${encodeURIComponent(text)}?page=${currentPage}&limit=10`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setJobs(json.data || []);
      setTotalPages(json.totalPages || 1);
      setTotal(json.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers(1);
  }, [fetchOffers]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setPage(1);

      if (search.trim().length >= 2) {
        fetchSearch(search.trim(), 1);
      } else if (search.trim().length === 0) {
        fetchOffers(1);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [search, fetchSearch, fetchOffers]);

  const handlePageChange = (p) => {
    setPage(p);
    if (search.trim().length >= 2) {
      fetchSearch(search.trim(), p);
    } else {
      fetchOffers(p);
    }
  };

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleClearFilters = () => {
    setFilters({ jobType: "all", salaryMax: 150000, workTypes: [] });
    setSearch("");
    setLocation("");
    setPage(1);
    fetchOffers(1);
  };

  const displayed = jobs
    .filter((job) => {
      const matchesLocation =
        !location ||
        (job.location || "").toLowerCase().includes(location.toLowerCase());
      const matchesType =
        filters.jobType === "all" || job.job_type === filters.jobType;
      const matchesSalary =
        !job.salary || Number(job.salary) <= filters.salaryMax;
      const matchesWorkType =
        filters.workTypes.length === 0 ||
        filters.workTypes.includes(job.work_type);
      return matchesLocation && matchesType && matchesSalary && matchesWorkType;
    })
    .sort((a, b) => {
      if (sortBy === "salary")
        return (Number(b.salary) || 0) - (Number(a.salary) || 0);
      if (sortBy === "recent")
        return new Date(b.published_at || 0) - new Date(a.published_at || 0);
      return (b.match || 0) - (a.match || 0);
    });

  return (
    <div className="sj-page">
      <div className="sj-header">
        <h1>Find Your Dream Job</h1>
        <p>{total} offres disponibles</p>
      </div>
      <div className="sj-search-row">
        <div className="sj-search-field">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by job title, company, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="sj-search-field location">
          <LocationOnOutlinedIcon />
          <input
            type="text"
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      <div className="sj-body">
        <aside>
          <FilterPanel
            filters={filters}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
          />
        </aside>
        <div className="mobile-filter-bar">
          <button className="mobile-filter-btn" onClick={() => setShowFilters(true)}>
            <FilterListIcon style={{ fontSize: 16 }} /> Filters
          </button>
          <select className="sj-sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="relevant">Most Relevant</option>
            <option value="recent">Most Recent</option>
            <option value="salary">Highest Salary</option>
          </select>
        </div>
        <section>
          <div className="sj-jobs-header">
            <select
              className="sj-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevant">Most Relevant</option>
              <option value="recent">Most Recent</option>
              <option value="salary">Highest Salary</option>
            </select>
          </div>

          {loading && (
            <div className="sj-loader">
              <div className="sj-spinner" />
            </div>
          )}

          {error && <div className="sj-error">⚠ {error}</div>}

          {!loading && !error && (
            <>
              <div className="sj-jobs-list">
                {displayed.length > 0 ? (
                  displayed.map((job) => (
                    <JobCard
                      key={job.offer_id}
                      job={job}
                      onSave={onSave}
                      initialLiked={likedIds.has(job.offer_id)}
                    />
                  ))
                ) : (
                  <div className="sj-empty">
                    No offers found.
                    <br />
                    <button onClick={handleClearFilters}>
                      Reset filters.
                    </button>
                  </div>
                )}
              </div>

              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
}