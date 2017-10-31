var audio_context;
var recorder;

window.onload = function init() {
	try{
		// webkit shim
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
		window.URL = window.URL || window.webkitURL;

		audio_context = new AudioContext;
	}catch(e){
		alert('No web audio support in this browser!');
    }

	navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
		alert("No live audio input");
	});
};

function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
	recorder = new Recorder(input);
 }

function startRecording(button){
	recorder && recorder.record();
	button.disabled = true;
	button.nextElementSibling.disabled = false;
	$(button).parent().addClass("recording");
}

function stopRecording(button){
	recorder && recorder.stop();
	button.disabled = true;
	button.previousElementSibling.disabled = false;
    
	// create WAV download link using audio data blob
	createDownloadLink();
	
	recorder.clear();
}

function createDownloadLink(){
	recorder && recorder.exportWAV(function(blob) {
		var url = URL.createObjectURL(blob);
		var au = document.createElement('audio');
		var hf = document.createElement('a');

		au.controls = true;
		au.src = url;
		hf.href = url;
		hf.download = $(".recording").attr("id") + '.wav';
		hf.innerHTML = hf.download;
		$(".recording > div").empty();
		$(".recording > div").append(au);
		$(".recording > div").append(hf);
		
		$(".recording").parent().parent().addClass("panel-success");
		$(".recording").removeClass("recording");
    });
  }