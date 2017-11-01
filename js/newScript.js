var stream;
var recorder;
var chunks;
var media;

window.onload = function init() {
	media = {tag: 'audio', type: 'audio/ogg', gUM: {audio: true}};
	
	navigator.mediaDevices.getUserMedia(media.gUM).then(_stream => {
		stream = _stream;
		recorder = new MediaRecorder(stream);
		recorder.ondataavailable = e =>{
			chunks.push(e.data);
			if(recorder.state == 'inactive') createDownloadLink();
		};
	});
	
	var i;
	
	for(i=1 ; i<=16 ; i++){
	$("#accordion").append("<div class=\"panel panel-default\">"+
								"<div class=\"panel-heading\">"+
									"<h4 class=\"panel-title\">"+
										"<a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapse"+i+"\">Point "+i+"</a>"+
									"</h4>"+
								"</div>"+
								"<div id=\"collapse"+i+"\" class=\"panel-collapse collapse\">"+
									"<div id=\"clip"+i+"\">"+
										"<button class=\"btn btn-success\" onclick=\"startRecording(this);\">record</button>"+
										"<button class=\"btn btn-danger\" onclick=\"stopRecording(this);\" disabled>stop</button>"+
										"<div></div>"+
									"</div>"+
								"</div>"+
							"</div>");
	}
	
	
};

function startRecording(button){
	button.disabled = true;
	button.nextElementSibling.disabled = false;
	$(button).parent().addClass("recording");
	chunks = [];
	recorder.start();
}

function stopRecording(button){
	recorder.stop();
	button.disabled = true;
	button.previousElementSibling.disabled = false;
    
	// create WAV download link using audio data blob
	//createDownloadLink();
}

function createDownloadLink(){
	var blob = new Blob(chunks, {type: media.type });
	var url = URL.createObjectURL(blob);
	var au = document.createElement(media.tag);
	var hf = document.createElement('a');

	au.controls = true;
	au.src = url;
	hf.href = url;
	hf.download = $(".recording").attr("id") + '.ogg';
	hf.innerHTML = hf.download;
	$(".recording > div").empty();
	$(".recording > div").append(au);
	$(".recording > div").append(hf);
	
	$(".recording").parent().parent().addClass("panel-success");
	$(".recording").removeClass("recording");
  }