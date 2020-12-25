export default {
  methods: {
    readTimestamp(timestamp) {
      function roundTime(time) {
        if (time < 10) {
          time = "0" + time.toString();
        }

        return time;
      }

      return (
        roundTime(timestamp.getHours()) +
        ":" +
        roundTime(timestamp.getMinutes()) +
        " " +
        roundTime(timestamp.getDate()) +
        "/" +
        roundTime(timestamp.getMonth()) +
        "/" +
        timestamp.getFullYear()
      );
    },
  },
};
