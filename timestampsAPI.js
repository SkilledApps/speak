import React from 'react-native';

const { AsyncStorage } = React;

const TimestampsAPI = {
  restore(key) {
    return AsyncStorage.getItem('timestamps.' + key);
  },
  persist(key, value) {
    return AsyncStorage.setItem('timestamps.' + key, JSON.stringify(value));
  },
  /* Добавляем но не просто в конец, а еще сортируем и проверяем на дубликат (вдруг два раза тапнул) */
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
  /* Удаляем вырезая из середины и возвращаем новый массив (что важно) */
  deleteTimestamp(timestamps, index) {
    return timestamps.slice(0, index).concat(timestamps.slice(index + 1));
  },
  /* Сдвинуть границу отрезка (маркер) влево или вправо на заданное число delta (in sec) */
  moveTimestamp(timestamps, index, delta) {
    const changedMarker = timestamps[index];
    changedMarker.time = Math.round((changedMarker.time + delta) * 100) / 100;
    return timestamps.slice(0, index).concat([changedMarker], timestamps.slice(index + 1));
  },
  /* Получить индекс зная только время */
  getIndexByTime(timestamps, time) {
    const index = timestamps.filter(t => t.time > time);
    return index.length;
  }
}


module.exports = TimestampsAPI;