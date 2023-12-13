document.querySelector(':root').style.setProperty('--s', ratio.value + 'px');
ratio.onchange = () => {
	if (isNaN(ratio.value)) {
		ratioerror.innerHTML = `這不是一個數字！`;
	} else if (ratio.value * 1 < 1) {
		ratioerror.innerHTML = `這不是一個正數！`;
	} else if (!Number.isInteger(ratio.value * 1)) {
		ratioerror.innerHTML = `這不是一個整數！`;
	} else {
		ratioerror.innerHTML = ``;
	}
};
ratioset.onclick = () => document.querySelector(':root').style.setProperty('--s', ratio.value + 'px');

function 清除所有子元素(element) {
	while (element.firstChild) {
		清除所有子元素(element.firstChild);
		element.removeChild(element.firstChild);
	}
}

async function 裁剪白邊() {
	let w = inputimg.naturalWidth,
		h = inputimg.naturalHeight;
	let canvas = text2html(`<canvas width="${w}" height="${h}"/>`);
	let ctx = canvas.getContext("2d");
	ctx.drawImage(inputimg, 0, 0);
	let imagedata = ctx.getImageData(0, 0, w, h);
	let d = imagedata.data;
	let lo = w, ro = 0, to = h, bo = 0;
	for (let i = 0; i < h; i++) {
		for (let j = 0; j < w; j++) {
			let k = (i * w + j) * 4;
			if (d[k] == 255 ||
				d[k + 1] == 255 ||
				d[k + 2] == 255 ||
				d[k + 3] == 255) {
				lo = Math.min(j, lo);
				ro = Math.max(j, ro);
				to = Math.min(i, to);
				bo = Math.max(i, bo);
			}
		}
	}
	ro++;
	bo++;
	let w2 = ro - lo;
	let h2 = bo - to;
	let canvas2 = text2html(`<canvas width="${w2}" height="${h2}"/>`);
	let ctx2 = canvas2.getContext("2d");
	ctx2.drawImage(inputimg, lo, to, w2, h2, 0, 0, w2, h2);
	inputimg.src = await (new Promise(r => canvas2.toBlob(blob => r(blob2url(blob)))));
	await (new Promise(r => inputimg.onload = () => r()));
}

loadbtn.onclick = () => inputimg.src = blob2url(hostfile.files[0]);
makebtn.onclick = async () => {
	清除所有子元素(outputtable);
	if (cutout.checked)
		await 裁剪白邊();
	let w = inputimg.naturalWidth,
		h = inputimg.naturalHeight;
	showsize.innerHTML = `寬：${w}，高：${h}`;
	let canvas = text2html(`<canvas width="${w}" height="${h}"/>`);
	let ctx = canvas.getContext("2d");
	ctx.drawImage(inputimg, 0, 0);
	let imagedata = ctx.getImageData(0, 0, w, h);
	let d = imagedata.data;
	for (let i = 0; i < h; i++) {
		let tr = document.createElement('tr');
		outputtable.append(tr);
		for (let j = 0; j < w; j++) {
			let k = (i * w + j) * 4;
			let td = text2html(`<td title="Ｘ：${j}，Ｙ：${i}" style="background-color:rgba(${d[k]}, ${d[k + 1]}, ${d[k + 2]}, ${d[k + 3] / 255})">
			<svg width="100%" height="100%"><rect width="100%" height="100%" fill="#00ff0033"/></svg>
			</td>`);
			td.onmousemove = () => showpos.innerHTML = td.title;
			tr.append(td);
		}
	}
};
