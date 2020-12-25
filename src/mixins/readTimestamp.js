export default {
  methods: {
    readTimestamp(timestamp) {
      function prependTime(time) {
        if (time < 10) {
          time = "0" + time.toString();
        }

        return time;
      }

      return (
        prependTime(timestamp.getHours()) +
        ":" +
        prependTime(timestamp.getMinutes()) +
        " " +
        prependTime(timestamp.getDate()) +
        "/" +
        prependTime(timestamp.getMonth()) +
        "/" +
        timestamp.getFullYear()
      );
    },
  },
};
