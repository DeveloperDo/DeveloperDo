export default {
  methods: {
    translatePriority(priority) {
      switch (priority) {
        case 0:
          return "brak";
        case 1:
          return "niski";
        case 2:
          return "średni";
        case 3:
          return "wysoki";
        default:
          return "brak";
      }
    },
  },
};
