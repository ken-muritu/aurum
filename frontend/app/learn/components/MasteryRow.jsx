import { ChevronRight } from "lucide-react";
import Progress from "../../../components/Progress";

export default function MasteryRow({ title, progress = 0, lastAccessed, onClick }) {
  return (
    <button className="mastery-row" onClick={onClick} type="button">
      <span className="mastery-row-title">{title}</span>
      <span className="mastery-row-progress"><Progress value={progress} /></span>
      <span className="mastery-row-meta">{lastAccessed ? `Updated ${lastAccessed}` : ""}</span>
      <span className="mastery-row-chevron" aria-hidden><ChevronRight size={16} /></span>
    </button>
  );
}
