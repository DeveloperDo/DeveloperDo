export default {
  methods: {
    readTimestamp(timestamp, dateOnly = false) {
        if (!timestamp) return ""

      function prependTime(time) {
        if (time < 10) {
          time = "0" + time.toString();
        }

        return time;
      }

      if (dateOnly) {
        return (
            prependTime(timestamp.getDate()) +
            "/" +
            prependTime(timestamp.getMonth() + 1) +
            "/" +
            timestamp.getFullYear()
        );
      }

      return (
          prependTime(timestamp.getHours() + 1) +
          ":" +
          prependTime(timestamp.getMinutes()) +
          " " +
          prependTime(timestamp.getDate()) +
          "/" +
          prependTime(timestamp.getMonth() + 1) +
          "/" +
          timestamp.getFullYear()
      );
    },
  },
};