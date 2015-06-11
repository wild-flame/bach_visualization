var Machine = function(canvasObj) {
    this.cv = canvasObj;
    this.elmLoader = document.getElementById("loader");
}

Machine.prototype.init = function() {
    // this.elmLoader = document.getElementById("loader");
};

Machine.prototype.doneLoading = function() {
    if (!SHOW_FRAMERATE) {
        this.elmLoader.style.display = "none";
    }
};
