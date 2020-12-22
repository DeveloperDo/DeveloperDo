export default {
  methods: {
    getImg(imageSrc) {
      if (imageSrc) {
        return imageSrc;
      } else {
        return "https://thumbs.dreamstime.com/b/default-avatar-photo-placeholder-profile-icon-eps-file-easy-to-edit-default-avatar-photo-placeholder-profile-icon-124557887.jpg";
      }
    },
  },
};
