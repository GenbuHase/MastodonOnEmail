var WPM = 2;

function scheduleInit () {
  var scheduleAt = new Date();
  scheduleAt.setMinutes(scheduleAt.getMinutes() + 1);
  
  for (var i = 0; i < WPM; i++) {
    scheduleAt.setSeconds(60 / WPM * i);
    
    ScriptApp.newTrigger("_schedule").timeBased().at(scheduleAt).create();
    
    if (i == WPM - 1) {
      var clearAt = scheduleAt;
      clearAt.setSeconds(clearAt.getSeconds() + 20);
      
      ScriptApp.newTrigger("_scheduleClear").timeBased().at(clearAt).create();
    }
  }
}

function scheduleEnd () {
  var triggers = ScriptApp.getProjectTriggers();
  
  triggers.forEach(function (trigger) {
    switch (trigger.getHandlerFunction()) {
      case "run":
        ScriptApp.deleteTrigger(trigger);
        break;
    }
  });
}

function _schedule () {
  ScriptApp.newTrigger("run").timeBased().everyMinutes(1).create();
}

function _scheduleClear () {
  var triggers = ScriptApp.getProjectTriggers();
  
  triggers.forEach(function (trigger) {
    switch (trigger.getHandlerFunction()) {
      case "_schedule":
      case "_scheduleClear":
        ScriptApp.deleteTrigger(trigger);
        break;
    }
  });
}



function run () {
  var threads = GmailApp.search("-in:(trash) is:(unread) subject:(" + Mstdn.PARSER.SUBJECT + ")", 0, 50);
  
  threads.forEach(function (thread) {
    var subject = thread.getFirstMessageSubject().match(Mstdn.PARSER.SUBJECT);
    
    if (subject) {
      var mode = (subject[1] || "").toUpperCase();
      var instance = (subject[2] || "");
      var visibility = (subject[3] || "public");
      
      var mstdn = new Mstdn(instance);
      var mails = thread.getMessages();

      mails.forEach(function (mail) {
        var from = mail.getFrom();
        
        if (mail.isUnread()) {
          switch (mode) {
            default:
            case ":TOOT":
              var tootContent = mail.getPlainBody();
              mstdn.toot(tootContent, visibility.getClassName() === "Number" ? Mstdn.VISIBILITY[visibility] : visibility);
              
              break;
              
            case ":NOTIFY":
              mstdn.sendNotificationInfo(from);
              break;
          }
          
          mail.markRead();
          mail.moveToTrash();
        }
      });
    }
  });
}