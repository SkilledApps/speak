import React from 'react-native';

const { AsyncStorage } = React;

const TimestampsAPI = {
  restore(key) {
    return AsyncStorage.getItem('timestamps.' + key);
  },
  persist(key, value) {
    return AsyncStorage.setItem('timestamps.' + key, JSON.stringify(value));
  },
  addTimestamp(timestamps, time) {
    // TODO: more validation
    const isDublicate = timestamps && timestamps.filter(t => t.time === time || Math.abs(t.time - time)*1000 < 200).length > 0 // 200 ms thrueshold
    if (isDublicate) {
      alert('it is dublicate, so ignore it (TODO: disable this alert');
      return timestamps;
    } else {
      const newTimestamp = {
        title: '<no title>',
        isMuted: false,
        time
      }

      return timestamps ? timestamps.concat([newTimestamp]).sort((a, b) => b.time - a.time) : [newTimestamp];
    }
  },
  deleteTimestamp(timestamps, index) {
    return timestamps.slice(0, index).concat(timestamps.slice(index + 1));
  },
  moveTimestamp(timestamps, index, delta) {
    const changedMarker = timestamps[index];
    changedMarker.time = Math.round((changedMarker.time + delta) * 100) / 100;
    return timestamps.slice(0, index).concat([changedMarker], timestamps.slice(index + 1));
  },
  getIndexByTime(timestamps, time) {
    const index = timestamps.filter(t => t.time > time);
    console.log('current position:', index.length, timestamps.length);
    return index.length;
    // if (index.length > 0 && index.length < timestamps.length) {
    //   return index.length;
    // } else {
    //   return timestamps.length - 1;
    // }
  }
}


module.exports = TimestampsAPI;