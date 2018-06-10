Object.defineProperties(Object.prototype, {
  getClassName: {
    /** @returns {String} */
    value: function () {
      return Object.prototype.toString.call(this).slice(8, -1);
    }
  }
});



Object.defineProperties(String.prototype, {
  repeat: {
    /** 
     * @param {Number} count
     * @returns {String}
     */
    value: function (count) {
      if (this == null) {
        throw new TypeError("can't convert " + this + " to object");
      }
      
      if (count < 0) {
        throw new RangeError("repeat count must be non-negative");
      } else if (count == Infinity) {
        throw new RangeError("repeat count must be less than infinity");
      }
      
      return new Array(count + 1).join(this);
    }
  }
});