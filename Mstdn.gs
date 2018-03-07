var Mstdn = {
  PARSER: {
    SUBJECT: /MoE(:[^@<>]+(?=@))?@([^<>]*)(?:<(.)>)?/,
    CW: /\[CW ?\| ?(.*)\]\r?\n/
  },
  
  VISIBILITY: ["public", "unlisted", "private", "direct"],
  
  
  
  parseHTML: function (htmlStr) {
    return htmlStr.replace(/(<\/p>)/g, "$1\n\n").replace(/<br ?\/?>/g, "\n").replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "").slice(0, -2);
  },
  
  get: function (instance, token, apiUrl) {
    var option = {
      method: "GET",
      
      headers: {
        "Authorization": "Bearer " + token
      }
    }
    
    return UrlFetchApp.fetch("https://" + instance + "/" + apiUrl, option);
  },
  
  post: function (instance, token, apiUrl, payload) {
    var option = {
      method: "POST",
      
      headers: {
        "Authorization": "Bearer " + token
      },
      
      payload: payload
    }
    
    return UrlFetchApp.fetch("https://" + instance + "/" + apiUrl, option);
  },
  
  getNotifies: function (instance, token) {
    var getNotifiesOption = {
      method: "GET",
      
      headers: {
        "Authorization": "Bearer " + token
      }
    }
    
    return JSON.parse(Mstdn.get(instance, token, "api/v1/notifications").getContentText());
  },
  
  getMentions: function (instance, token) {
    var notifies = Mstdn.getNotifies(instance, token);
    
    return notifies.filter(function (notify) {
      return notify.type == "mention";
    });
  },
  
  toot: function (instance, token, content, visibility) {
    var CW = content.match(Mstdn.PARSER.CW) || [];
    
    content = content.replace(CW[0], "");
    
    Mstdn.post(instance, token, "api/v1/statuses", {
      status: [
        content,
        "",
        "from #MoE",
        "#MastodonOnEmail"
      ].join("\r\n"),
      
      spoiler_text: CW[1],
      visibility: visibility
    });
  },
  
  sendNotifyInfo: function (instance, token, address) {
    var messages = [];
    var mentions = Mstdn.getMentions(instance, TOKENS[instance]);
    
    mentions.forEach(function (mention) {
      messages.push([
        "<" + new Date(mention.created_at).toLocaleString() + "> " + mention.account.acct,
        Mstdn.parseHTML(mention.status.content)
      ].join("\r\n"));
    });
    
    Logger.log(messages.join("\n\n"));
    GmailApp.sendEmail(address, "[MoE] " + instance + "の通知情報", messages.join("\n\n"));
  }
}