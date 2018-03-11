let text = [
	"[CW | テスト]",
	"[harukin | 9]",
	"[harukin | 2]",
	"ぐへへへおぼほほぼびょろろろろろろwwwwww"
].join("\n");

let harukinR = /\[harukin ?\| ?([^\]]*)\]/

let txtR = text.match(new RegExp(harukinR, "g"));

for (let i = 0; i < txtR.length; i++) {
	debug.log(txtR[i].match(harukinR)); //2, 9
}