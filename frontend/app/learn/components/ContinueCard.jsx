import Progress from "../../../components/Progress";
import Button from "../../../components/Button";

export default function ContinueCard({ mastery, moduleTitle, lessonTitle, progress, onResume }) {
  return (
    <div className="continue-card stack">
      <div className="continue-meta">
        <h2>{mastery?.title}</h2>
        <p>{moduleTitle} · {lessonTitle}</p>
      </div>
      <div className="continue-progress">
        <div className="continue-progress-meta">
          <span>Progress</span>
          <span>{Math.round(progress ?? 0)}%</span>
        </div>
        <Progress value={progress ?? 0} />
      </div>
      <Button variant="primary" className="btn-block" onClick={onResume} type="button">
        Resume
      </Button>
    </div>
  );
}
