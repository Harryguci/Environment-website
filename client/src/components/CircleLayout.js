export default function CircleLayout({ top, left, bottom, right, transform }) {
  return (
    <div
      className="circle-layout"
      style={{
        top: top,
        left: left,
        bottom: bottom,
        right: right,
        transform: transform,
      }}
    ></div>
  );
}
