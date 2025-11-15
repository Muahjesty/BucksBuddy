import EventCard from '../EventCard';
import diningImage from '@assets/generated_images/Campus_dining_event_thumbnail_05852da1.png';
import festivalImage from '@assets/generated_images/Campus_festival_event_thumbnail_7d3e3ff7.png';
import studyImage from '@assets/generated_images/Study_session_event_thumbnail_4349af44.png';

export default function EventCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <EventCard
        title="Late Night Dining"
        category="Dining"
        price={8.50}
        date={new Date(Date.now() + 86400000)}
        imageUrl={diningImage}
        location="Student Union"
      />
      <EventCard
        title="Spring Festival"
        category="Event"
        price={15.00}
        date={new Date(Date.now() + 172800000)}
        imageUrl={festivalImage}
        location="Campus Quad"
      />
      <EventCard
        title="Study Group Session"
        category="Wellness"
        price={5.00}
        date={new Date(Date.now() + 259200000)}
        imageUrl={studyImage}
        location="Main Library"
      />
    </div>
  );
}
