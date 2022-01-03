export default function(ref) {
  return {
    methods: {
      blur() {
        this.$refs[ref].blur();
      }
    }
  };
};