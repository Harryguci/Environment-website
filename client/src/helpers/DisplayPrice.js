export default function DisplayPrice(price) {
  var temp = price + "";
  var res = "";
  for (var i = temp.length - 1; i >= 0; i--) {
    if (i - temp.length + 1 && (i - temp.length + 1) % 3 === 0)
      res = temp[i] + "," + res;
    else res = temp[i] + res;
  }
  return res;
}
