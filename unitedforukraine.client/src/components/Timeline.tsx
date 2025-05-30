import { FC } from "react";
import { TimelineItem } from "../types";

type TimelineProps = {
  timelines: TimelineItem[];
};

const Timeline: FC<TimelineProps> = ({ timelines }) => {
  const options: Record<string, string> = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    <div className="row mt-5 mb-4">
      <div className="col">
        <div className="timeline-steps">
          {timelines.map((timeline: TimelineItem) => (
            <div className="timeline-step mb-0" key={timeline.date}>
              <div className="timeline-content">
                <div className="inner-circle"></div>
                <p className="h6 mt-3 mb-1">
                  {new Date(timeline.date).toLocaleDateString("en-US", options)}
                </p>
                <p className="h6 text-muted mb-0 mb-lg-0">
                  {timeline.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
