let url;
let 倍率 = 10;
document.querySelector(':root').style.setProperty('--s', 倍率 + 'px');
loadbtn.onclick = () => inputimg.src = url = blob2url(hostfile.files[0]);
// urlloadbtn.onclick = () => inputimg.src = urltext.value;
makebtn.onclick = async () => {
	let w = inputimg.naturalWidth,
		h = inputimg.naturalHeight;
	let canvas = text2html(`<canvas width="${w}" height="${h}"/>`);
	let ctx = canvas.getContext("2d");
	ctx.drawImage(inputimg, 0, 0);
	// ctx.drawImage(inputimg, 0, 0, inputimg.naturalWidth, inputimg.naturalHeight, 0, 0, w, h);
	let imagedata = ctx.getImageData(0, 0, w, h);
	let d = imagedata.data;
	let s = '';
	for (let i = 0; i < h; i++) {
		s += '<tr>';
		for (let j = 0; j < w; j++) {
			let k = (i * w + j) * 4;
			s += `<td title="x:${j}, y:${i}" style="background-color:rgba(${d[k]}, ${d[k + 1]}, ${d[k + 2]}, ${d[k + 3] / 255})">
			<svg width="${倍率}" height="${倍率}"><rect  width="${倍率}" height="${倍率}" fill="#00ff0033"/></svg>
			</td>`;
		}
		s += '</tr>';
	}
	outputtable.innerHTML = s;
}
