export default {
  methods: {
    translateStatus(status) {
      switch (status) {
        case 0:
          return "do zrobienia";
        case 1:
          return "w trakcie";
        case 2:
          return "wstrzymane";
        case 3:
          return "zrobione";
        case 4:
          return "wdrożone";
        default:
          return "";
      }
    },
  },
};
