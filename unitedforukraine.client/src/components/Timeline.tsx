import { FC } from "react";
import { TimelineItem } from "../types";
import { convertToReadableDate } from "../utils/dateHelper";

type TimelineProps = {
  timelines: TimelineItem[];
};

const Timeline: FC<TimelineProps> = ({ timelines }) => {
  return (
    <div className="row mt-5 mb-4">
      <div className="col">
        <div className="timeline-steps">
          {timelines.map((timeline: TimelineItem) => (
            <div className="timeline-step mb-0" key={timeline.date}>
              <div className="timeline-content">
                <div className="inner-circle"></div>
                <p className="h6 mt-3 mb-1">
                  {convertToReadableDate(timeline.date)}
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
