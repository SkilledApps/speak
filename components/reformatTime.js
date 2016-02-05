export default function reformat(time) {
  if (!time) {
    return '--:--'
  }
  time = Math.floor(time);
  const pad = v => (new Array(3).join('0') + v).slice(-2);
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return pad(minutes) + ':' + pad(seconds);
}
