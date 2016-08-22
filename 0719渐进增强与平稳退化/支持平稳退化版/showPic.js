function showPic( whichPic){
	
	var pichref=whichPic.getAttribute("href");
	var placeholder=yc.$("placeholder");
	placeholder.src=pichref;
	var text=whichPic.getAttribute("title");
	var description=yc.$("description");
	description.firstChild.nodeValue=text;
}
