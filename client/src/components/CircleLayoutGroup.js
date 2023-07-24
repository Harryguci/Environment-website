import CircleLayout from "./CircleLayout";

export default function CircleLayoutGroup() {
  return (
    <>
      <CircleLayout top={30} right={0} transform="translate(50%, -30%)" />
      <CircleLayout top={45 + "rem"} left={0} transform="translate(-50%, 0%)" />
      <CircleLayout
        top={130 + "rem"}
        right={0}
        transform="translate(50%, 0%)"
      />
    </>
  );
}
