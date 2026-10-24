import { Search } from "lucide-react";
import EmptyState from "../../../components/EmptyState";
import Button from "../../components/Button";

export default function DiscoverPanel({ items, search, onSearch, onUse }) {
  return (
    <div className="discover">
      <div className="discover-header">
        <div className="input-field">
          <span className="input-icon" aria-hidden><Search size={16} /></span>
          <input
            value={search}
            onChange={(e) => onSearch?.(e.target.value)}
            placeholder="Search public masteries"
          />
        </div>
      </div>
      {items?.length ? (
        <div className="discover-list">
          {items.map((item) => (
            <div key={item.id} className="discover-card">
              <div>
                <div className="discover-title">{item.title}</div>
                <div className="discover-meta">{item.outcome} · {item.estimatedTime} · {item.level}</div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => onUse?.(item)} type="button">
                Use this Mastery
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={null}
          message="No public masteries found."
          action={
            <Button variant="ghost" onClick={() => onSearch?.("")}>
              Clear search
            </Button>
          }
        />
      )}
    </div>
  );
}
