import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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

import NewJobCard from "../../components/NewJobcard";
import FilterPanel from "../../components/filter";
import Pagination from "../../components/pagination";
const BASE_URL = "http://localhost:3001";
const ITEMS_PER_PAGE = 10;

export default function SearchJobs({ onSave }) {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("relevant");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [likedIds, setLikedIds] = useState(new Set());
  const [filters, setFilters] = useState({
    jobType: "all",
    salaryMax: 150000,
    workTypes: [],
  });

  const fetchLikedOffers = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/users/offersUserLikes`, {
        credentials: "include",
      });
      if (!res.ok) return;
      const data = await res.json();
      setLikedIds(
        new Set(Array.isArray(data) ? data.map((job) => job.offer_id) : []),
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `${BASE_URL}/api/offers/allOffers?page=1&limit=9999`,
          { credentials: "include" },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setAllJobs(json.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
    fetchLikedOffers();
  }, [fetchLikedOffers]);

  useEffect(() => {
    setPage(1);
  }, [filters, search, location, sortBy]);

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleClearFilters = () => {
    setFilters({ jobType: "all", salaryMax: 150000, workTypes: [] });
    setSearch("");
    setLocation("");
  };

  const filtered = useMemo(() => {
    let result = allJobs.filter((job) => {
      const s = search.trim().toLowerCase();
      const matchesSearch =
        !s ||
        (job.title || "").toLowerCase().includes(s) ||
        (job.company_name || "").toLowerCase().includes(s) ||
        (job.skills || []).some((sk) => sk.toLowerCase().includes(s)) ||
        (job.about || "").toLowerCase().includes(s);

      const matchesLocation =
        !location.trim() ||
        (job.location || "")
          .toLowerCase()
          .includes(location.trim().toLowerCase());

      const matchesType =
        filters.jobType === "all" || job.job_type === filters.jobType;

      const matchesSalary =
        !job.salary || Number(job.salary) <= filters.salaryMax;

      const matchesWorkType =
        filters.workTypes.length === 0 ||
        filters.workTypes.includes(job.work_type);

      return (
        matchesSearch &&
        matchesLocation &&
        matchesType &&
        matchesSalary &&
        matchesWorkType
      );
    });

    if (sortBy === "salary")
      result = [...result].sort(
        (a, b) => (Number(b.salary) || 0) - (Number(a.salary) || 0),
      );
    else if (sortBy === "recent")
      result = [...result].sort(
        (a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0),
      );

    return result;
  }, [allJobs, search, location, filters, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const displayed = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <div className="sj-page">
      <div className="sj-header">
        <h1>Find Your Dream Job</h1>
        <p>
          {filtered.length} offer{filtered.length !== 1 ? "s" : ""}
        </p>
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
          <button
            className="mobile-filter-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterListIcon style={{ fontSize: 16 }} /> Filters
          </button>
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

        {showFilters && (
          <div className="mobile-filter-panel">
            <FilterPanel
              filters={filters}
              onChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </div>
        )}

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
                    <NewJobCard
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
                    <button onClick={handleClearFilters}>Reset filters.</button>
                  </div>
                )}
              </div>

              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
}
