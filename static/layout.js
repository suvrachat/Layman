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
  var queryInput, resultDiv, accessTokenInput,contractfile;
  var defaultText = 'I did not get that , You can ask me<ol><li>Conditions of Contract</li><li>Citations in contract etc</li></ol>';
  window.onload = init;

  function init() {
    queryInput = document.getElementById("q");
    resultDiv = document.getElementById("result");
    contractfile = document.getElementById("contractfile");
    var uploadContractButton = document.getElementById("upload_contract");
    document.getElementById("main-wrapper").style.display = "none";
    queryInput.addEventListener("keydown", queryInputKeyDown);
    uploadContractButton.addEventListener("click", uploadContract);
   
  }
  
  
  function uploadContract(){
	  var file;
	  contractfile.files.length > 0 ? file = contractfile.files[0] : file="No file is uploaded"; 	 
    var fd = new FormData();
    fd.append('file', $('input[type=file]')[0].files[0])
    $.ajax({
      url: './uploader',  
      type: 'POST',
      data: fd,
      success:function(data){
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
    var responseNode = createResponseNode();

    sendText(value)
      .then(function(response) {
        var result;
        try {
          result = response.result.fulfillment.speech
        } catch(error) {
          result = "";
        }
        sendToServer(result,responseNode);
        
      })
      .catch(function(err) {
        setResponseOnNode("Something goes wrong", responseNode);
      });
  }
  
  function sendToServer(query,responseNode){
	  var url="/contractadvisor/"
	  var response;
	  if(query===defaultText){
		  setResponseOnNode(query,responseNode);
		  return;  
	  }
	  
	  else if(query.includes('Title')){
		  url=url+"title";
	  }
	  
	  else if(query.includes('Review')){
		  url=url+"suspicious";
	  }
	  else if(query.includes("Conditions")){
		  url=url+"conditions";
	  }
	  else if(query.includes("Active")){
		  url=url+"startdate";
	  }
	  $.ajax({
	      url: url,  
	      type: 'GET',
	      success:function(data){
	          response=data;
	          setResponseOnNode(response, responseNode);
	      },
	      error: function(error){
		      	alert("Error Occured:"+error)
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
    node.className = "clearfix right-align right card-panel blue-text text-darken-2 hoverable";
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

})();
