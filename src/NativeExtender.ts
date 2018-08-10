Object.defineProperties(String.prototype, {
	repeat: {
		value (count: number): string {
			if (this == null) throw new TypeError("can't convert " + this + " to object");
			if (count < 0) throw new RangeError("repeat count must be non-negative");
			if (count === Infinity) throw new RangeError("repeat count must be less than infinity");
			
			return new Array(count + 1).join(this);
		}
	}
});