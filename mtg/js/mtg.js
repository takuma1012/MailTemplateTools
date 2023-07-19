const generateString = () => {
	tlist = formatArray();
	newt = "";
	for (const [i, s] of Object.entries(tlist)) {
		len = tlist.length -1;
	    if ((i == 0 || i == len) && s === "") continue;
	    newt += i != 0 ? ' '.repeat(15) + '\"' + s : '\"' + s;
	    newt += i < len ? '\\n\" +\n' : '\",';
	}
	c2 = $("#floatingTextarea2");
	c2.val(newt);
};

const formatArray = () => {
	isThrough = false;
	c1 = $("#floatingTextarea1");
	let l = c1.val().split('\n');
	while(!isThrough) {
		console.log(l);
		let len = l.length-1;

		if (l[0] === "") {
			l.splice(0, 1);
			isThrough = false;
		} else {
			isThrough = true;
		}

		if (l[len] === "") {
			l.splice(len, 1);
			isThrough = isThrough ? false : isThrough;
		} else {
			isThrough = isThrough ? true : isThrough;
		}
	}
	return l;
};

const clearBody = () => {
	$("#floatingTextarea2").val("");
	$("#js-copy").text("コピー");
	$("#js-copy").attr("class", "btn btn-outline-primary btn-sm");
};

const copyToClipboard = () => {
  // コピーする文章の取得
  let text = $("#floatingTextarea2").val();
  // Copyの文字を変更
  $("#js-copy").text("Copied!!");
  $("#js-copy").attr("class", "btn btn-primary btn-sm");
  
  if (navigator.clipboard == undefined) {
    window.clipboardData.setData("Text", text);
  } else {
    navigator.clipboard.writeText(text);
  }
};