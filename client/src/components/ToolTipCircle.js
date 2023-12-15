import { useState, useMemo, useEffect } from "react";
import { CircleMarker, Tooltip } from "react-leaflet";

export default function TooltipCircle({ center, radius }) {
  const [clickedCount, setClickedCount] = useState(0);
  const eventHandlers = useMemo(
    () => ({
      click() {
        setClickedCount((count) => count + 1);
      },
    }),
    []
  );

  useEffect(() => console.log(center), [center]);

  return (
    <CircleMarker
      center={[center.lat, center.lng]}
      pathOptions={{ color: "red" }}
      radius={radius}
      eventHandlers={eventHandlers}
    >
      <Tooltip>Tooltip for CircleMarker {clickedCount}</Tooltip>
    </CircleMarker>
  );
}
