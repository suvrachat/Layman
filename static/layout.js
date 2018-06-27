/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function() {
	"use strict";

	var ENTER_KEY_CODE = 13;
	var queryInput, resultDiv, accessTokenInput, contractfile;
	var defaultText =
		'I did not get that , You can ask me<ol><li>Conditions of Contract</li><li>Review of contract</li><li>Title of contract</li><li>whether contract is active</li></ol>';

	window.onload = init;

	function init() {
		queryInput = document.getElementById("q");
		resultDiv = document.getElementById("result");
		contractfile = document.getElementById("contractfile");
		var uploadContractButton = document.getElementById("upload_contract");
		document.getElementById("main-wrapper").style.display = "none";
		if (queryInput !== null) {
			queryInput.addEventListener("keydown", queryInputKeyDown);
		}
		if (uploadContractButton !== null) {
			uploadContractButton.addEventListener("click", uploadContract);
		}
	}

	function uploadContract() {
		var file;
		contractfile.files.length > 0 ? file = contractfile.files[0] : file = "No file is uploaded";
		var fd = new FormData();
		fd.append('file', $('input[type=file]')[0].files[0])
		$.ajax({
			url: './uploader',
			type: 'POST',
			data: fd,
			success: function(data) {
				alert(data);
			},
			cache: false,
			contentType: false,
			processData: false
		});
		document.getElementById("main-wrapper").style.display = "block";
		setAccessToken();
	}

	function setAccessToken() {
		window.init();
	}

	function queryInputKeyDown(event) {
		if (event.which !== ENTER_KEY_CODE) {
			return;
		}

		var value = queryInput.value;
		queryInput.value = "";

		createQueryNode(value);

		sendText(value)
			.then(function(response) {
				var responseNode = createResponseNode();
				var result;
				try {
					result = response.result.fulfillment.speech
				} catch (error) {
					result = "";
				}
				sendToServer(result,responseNode);
				//setResponseOnNode(result, responseNode);

			})
			.catch(function(err) {
				var responseNode = createResponseNode();
				setResponseOnNode("Something goes wrong", responseNode);
			});
	}

	function sendToServer(query, responseNode) {
		var url = "/contractadvisor/"
		var response;
		if (query === defaultText) {
			setResponseOnNode(query, responseNode);
			return;
		} else if (query.includes('Title')) {
			url = url + "title";
		} else if (query.includes('Review')) {
			url = url + "suspicious";
		} else if (query.includes("Conditions")) {
			url = url + "conditions";
		} else if (query.includes("Active")) {
			url = url + "startdate";
		}
		$.ajax({
			url: url,
			type: 'GET',
			success: function(data) {
				response = data;

				if (query.includes("Conditions")) {
					data = data.replace("[[", "");
					data = data.replace("[", "");
					data = data.replace("[", "");
					data = data.split(", \"\"]");
					data.pop();
					response = '<ol><li>' + data.join("</li><li>"); + '</li></ol>'

				}
				setResponseOnNode(response, responseNode);
			},
			error: function(error) {
				alert("Error Occured:" + error)
			},
			cache: false,
			contentType: false,
			processData: false
		});
	}

	function createQueryNode(query) {
		var node = document.createElement('div');
		node.className = "clearfix left-align left card-panel green accent-1";
		node.innerHTML = query;
		resultDiv.appendChild(node);
	}

	function createResponseNode() {
		var node = document.createElement('div');
		node.className = "clearfix left-align right card-panel blue-text text-darken-2 hoverable";
		node.innerHTML = "...";
		resultDiv.appendChild(node);
		return node;
	}

	function setResponseOnNode(response, node) {
		node.innerHTML = response ? response : "[empty response]";
		node.setAttribute('data-actual-response', response);
	}

	function sendRequest() {

	}

	//////////////////---SPPPPEECCHH--------\\\\\\\\\\\\

	$("#rec").click(function(event) {

		switchRecognition();

	});

	var msg = new SpeechSynthesisUtterance('Hello World');

	$(document).ready(function() {

		$("#q").keypress(function(event) {

			if (event.which == 13) {

				event.preventDefault();

				send();

			}

		});

		$("#rec").click(function(event) {

			switchRecognition();

		});

	});

	var recognition;

	function startRecognition() {

		recognition = new webkitSpeechRecognition();

		recognition.onstart = function(event) {

			updateRec();

		};

		recognition.onresult = function(event) {

			var text = "";

			console.log("recognition");

			for (var i = event.resultIndex; i < event.results.length; ++i) {

				text += event.results[i][0].transcript;

			}

			console.log(text);

			setInput(text);

			stopRecognition();

		};

		recognition.onend = function() {

			stopRecognition();

		};

		recognition.lang = "en-US";

		recognition.start();

	}

	function stopRecognition() {

		if (recognition) {

			recognition.stop();

			recognition = null;

		}

		updateRec();

	}

	function switchRecognition() {

		if (recognition) {

			stopRecognition();

		} else {

			startRecognition();

		}

	}

	function setInput(text) {

		console.log(text);

		$("#q").val(text);

		sendText(text)

		.then(function(response) {

			var result;

			try {

				result = response.result.fulfillment.speech

			} catch (error) {

				result = "";

			}

			var responseNode = createResponseNode();

			setResponseOnNode(result, responseNode);

		})

		.catch(function(err) {

			var responseNode = createResponseNode();

			setResponseOnNode("Something goes wrong", responseNode);

		});

	}

	function updateRec() {

		$("#rec").text(recognition ? "Stop" : "Speak");

	}

	function send() {

		var text = $("#input").val();

		$.ajax({

			type: "POST",

			url: baseUrl + "query?v=20150910",

			contentType: "application/json; charset=utf-8",

			dataType: "json",

			headers: {

				"Authorization": "Bearer " + accessToken

			},

			data: JSON.stringify({
				query: text,
				lang: "en",
				sessionId: "somerandomthing"
			}),

			success: function(data) {

				//setResponse(JSON.stringify(data, undefined, 2));

				setResponse(data.result.fulfillment.speech);

				var msg = new SpeechSynthesisUtterance(data.result.fulfillment.speech);

				window.speechSynthesis.speak(msg);

			},

			error: function() {

				setResponse("Internal Server Error");

			}

		});

		setResponse("Loading...");

	}

})();