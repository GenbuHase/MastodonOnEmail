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
  
  for (var i = 0; i < triggers.length; i++) {
    switch (triggers[i].getHandlerFunction()) {
      case "run":
        ScriptApp.deleteTrigger(triggers[i]);
        break;
    }
  }
}

function _schedule () {
  ScriptApp.newTrigger("run").timeBased().everyMinutes(1).create();
}

function _scheduleClear () {
  var triggers = ScriptApp.getProjectTriggers();
  
  for (var i = 0; i < triggers.length; i++) {
    switch (triggers[i].getHandlerFunction()) {
      case "_schedule":
      case "_scheduleClear":
        ScriptApp.deleteTrigger(triggers[i]);
        break;
    }
  }
}



function run () {
  var threads = GmailApp.search('is:unread subject:"MoE"', 0, 50);
  
  for (var i = 0; i < threads.length; i++) {
    var thread = threads[i];
    var subject = thread.getFirstMessageSubject().match(Mstdn.PARSER.SUBJECT);
    
    if (subject) {
      var mode = (subject[1] || "").toUpperCase(),
          instanceUrl = (subject[2] || ""),
          tootVisibility = (subject[3] || 0);
      
      var mstdn = new Mstdn(instanceUrl);
      var mails = thread.getMessages();
      
      for (var i = 0; i < mails.length; i++) {
        var mail = mails[i];
        var from = mail.getFrom();
        
        if (mail.isUnread()) {
          switch (mode) {
            default:
            case ":TOOT":
              var tootContent = mail.getPlainBody();
              mstdn.toot(tootContent, Mstdn.VISIBILITY[tootVisibility]);
              
              break;
              
            case ":NOTIFY":
              mstdn.sendNotificationInfo(from);
              break;
          }
          
          mail.markRead();
          mail.moveToTrash();
        }
      }
    }
  }
}