// class RecordingControl extends React.Component {
//   compon
// }
import { AudioRecorder, AudioPlayer } from 'react-native-audio';

// function generateName() {
//
// }
export function requestRecordPermission() {
  AudioRecorder.requestRecordPermission()
}
export function prepareRecording(trackId) {
  const recordName = '/record_' + trackId + '_' + new Date().getTime() + '.caf';
  AudioRecorder.prepareRecordingAtPath(recordName);
  return recordName;
}

export function startRecording() {
  AudioRecorder.startRecording();
}

export function pauseRecording() {
  AudioRecorder.pauseRecording();
}

export function stopRecording() {
  console.log('stopRecording()')
  return AudioRecorder.stopRecording();
}

export function playRecording(file, onProgress) {
  //AudioRecorder.prepareRecordingAtPath(file)
  AudioPlayer.play(file, 0);
  AudioPlayer.setProgressSubscription();
  AudioPlayer.onProgress = onProgress;
}

export function pausePlayer(file) {
  AudioPlayer.pause(file);
}

export function stopPlayer(file) {
  AudioPlayer.stop(file);
}


export function resume(file, time, onProgress) {
  AudioPlayer.play(file, time*1000);
  AudioPlayer.setProgressSubscription();
  AudioPlayer.onProgress = onProgress;
}
