import { memo } from 'react'
import { Popup, Polygon, Tooltip } from "react-leaflet";

function ToolTipPoly({ points, name }) {
  return (
    <>
      {(points && points.length && (
        <Polygon pathOptions={{ color: "blue" }} positions={points}>
          <Tooltip>{name || 'Viet Nam'}</Tooltip>
        </Polygon>
      )) || <Popup>Can not display</Popup>}
    </>
  );
}

export default memo(ToolTipPoly);