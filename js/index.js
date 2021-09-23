var $messages = $('.messages-content');
var serverResponse = "wala";



var suggession;
//speech reco
try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}
catch (e) {
  console.error(e);
  $('.no-browser-support').show();
}

$('#start-record-btn').on('click', function (e) {
  recognition.start();
});

recognition.onresult = (event) => {
  const speechToText = event.results[0][0].transcript;
  document.getElementById("MSG").value = speechToText;
  //console.log(speechToText)
  insertMessage()
}


function listendom(no) {
  console.log(no)
  //console.log(document.getElementById(no))
  document.getElementById("MSG").value = no.innerHTML;
  insertMessage();
}

$(window).load(function () {
  $messages.mCustomScrollbar();
  setTimeout(function () {
    serverMessage("Hallo!!! Ich bin  AbilityBOT");
  }, 100);

});

function updateScrollbar() {
  $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  });
}



function insertMessage() {
  msg = $('.message-input').val();
  if ($.trim(msg) == '') {
    return false;
  }
  $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
  fetchmsg(null)

  $('.message-input').val(null);
  updateScrollbar();

}
$(document).on('click', '.select-text', function () {
  var msg = this.innerHTML;
  //alert(msg);
  $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');

  $('.message-input').val(null);
  fetchmsg(msg)
  updateScrollbar();

});

document.getElementById("mymsg").onsubmit = (e) => {
  e.preventDefault()
  insertMessage();
  //speechSynthesis.speak( new SpeechSynthesisUtterance("hello"))
}

function serverMessage(response2) {


  if ($('.message-input').val() != '') {
    return false;
  }

  $('<div class="message loading new"><figure class="avatar"><img src="css/bot.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
  updateScrollbar();


  setTimeout(function () {
    $('.message.loading').remove();
    $('<div class="message new"><figure class="avatar"><img src="css/bot.png" /></figure>' + response2 + '</div>').appendTo($('.mCSB_container')).addClass('new');
    updateScrollbar();
    if (response2 == "Please upload the file data here for analysis") {
      var di = document.getElementById("cont");
      di.style.display = "";
      var divs = document.getElementById("mCSB_1_container").getElementsByTagName("div");
      var last = divs[divs.length - 1];
      console.log(last);
      last.appendChild(di);
    }
    var input = document.getElementById("wrapper");
    console.log(input)
    $('#upload').unbind().change(function (e) {
      var fileName = this.value;
      var allowed_extensions = new Array("csv", "xlsx");
      var file_extension = fileName.split('.').pop().toLowerCase();
      var flg = true;
      for (var i = 0; i <= allowed_extensions.length; i++) {
        if (allowed_extensions[i] == file_extension) {
          console.log("Waiting");
          var reader = new FileReader();
          reader.readAsArrayBuffer(e.target.files[0]);
          reader.onload = function (e) {
            console.log("1");
            var data = new Uint8Array(reader.result);
            var wb = XLSX.read(data, { type: 'array' });
            var htmlstr = XLSX.write(wb, { sheet: "%Impact", type: 'binary', bookType: 'html' });
            var table = document.getElementById("mytable").getElementsByTagName('tbody')[0];
            table.innerHTML += htmlstr;
            input.style.display = "";
            var tab = document.getElementById("mCSB_1_container");
            tab.appendChild(input);
            var res = '<p>For operation ID 1,2,3,5 the <b>Change in Strength </b> is minimal as operation has not reduced strength and <b>Tensile Stress</b>(Loss in Effeciency) level is maintained.<br><b>Prediction : No immediate action required</b><br></p>'
            $('<div class="message new"><figure class="avatar"><img src="css/bot.png" /></figure>' + res + '</div>').appendTo($('.mCSB_container')).addClass('new');
            var res2 = '<p>For operation ID 14 the <b>Final Condition</b> of tool is <b style="color: red;">extreme</b> compared to initial condition and <b>Change in Strength</b> is highly efftected causing <b>Tensile Stress</b>(Loss in Effeciency) level to drop. <br>Data use: Reliability of sensor technology, derivation of Wear box path <br><b>Prediction : Diagnosis sensor technology </b>Adjustment for light barrier with laser, by means of 2nd laser barrier Increase availability</p>'
            $('<div class="message new"><figure class="avatar"><img src="css/bot.png" /></figure>' + res2 + '</div>').appendTo($('.mCSB_container')).addClass('new');
            updateScrollbar();
          }

          flg = false;

        }
      }
      if (flg) {
        alert("The uploaded file has incompatable extension")
        this.value = "";

      }

    });

  }, 100 + (Math.random() * 20) * 100);

}

function validate_fileupload(value) {
  var allowed_extensions = new Array("csv", "xlsx");
  var file_extension = fileName.split('.').pop().toLowerCase();

  for (var i = 0; i <= allowed_extensions.length; i++) {
    if (allowed_extensions[i] == file_extension) {
      console.log("gotcha")
    }
  }

  return false;
}
function fetchmsg(msg) {

  var url = 'http://localhost:5000/send-msg';

  const data = new URLSearchParams();
  for (const pair of new FormData(document.getElementById("mymsg"))) {
    data.append(pair[0], pair[1]);
    console.log(pair)
  }
  if(msg != null){
    data.append("MSG", msg);
  }
  console.log("abc", data)
  fetch(url, {
    method: 'POST',
    body: data
  }).then(res => res.json())
    .then(response => {
      console.log(response);
      var textResponse = response.Reply;
      textResponse = textResponse.replace(/\\n/g, '<br>');
      serverMessage(textResponse);

      //  speechSynthesis.speak( new SpeechSynthesisUtterance(response.Reply))


    })
    .catch(error => console.error('Error h:', error));

}


