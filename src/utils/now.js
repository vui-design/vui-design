export default Date.now || function() {
	return new Date().getTime();
};
