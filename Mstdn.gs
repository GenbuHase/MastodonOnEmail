var Mstdn = (function () {
  function Mstdn (instance, token) {
    this.instance = instance,
    this.token = token;
  };

  Mstdn.prototype = Object.create(null, {
    constructor: { value: Mstdn },

    get: {
      value: function (apiUrl) {
        var option = {
          method: "GET",
          
          headers: {
            "Authorization": "Bearer " + this.token
          }
        }
        
        return UrlFetchApp.fetch("https://" + this.instance + "/" + apiUrl, option);
      }
    },

    post: {
      value: function (apiUrl, payload) {
        var option = {
          method: "POST",
          
          headers: {
            "Authorization": "Bearer " + this.token
          },
          
          payload: payload
        }
        
        return UrlFetchApp.fetch("https://" + this.instance + "/" + apiUrl, option);
      }
    },

    getNotifications: {
      value: function () {
        return JSON.parse(this.get("api/v1/notifications").getContentText());
      }
    },

    getMentions: {
      value: function () {
        var notifies = this.getNotifications();
        
        return notifies.filter(function (notify) {
          return notify.type == "mention";
        });
      }
    },

    sendNotificationInfo: {
      value: function (address) {
        var messages = [];
        var mentions = this.getMentions();
        
        mentions.forEach(function (mention) {
          messages.push([
            "<" + new Date(mention.created_at).toLocaleString() + "> " + mention.account.acct,
            Mstdn.parseHtml(mention.status.content)
          ].join("\r\n"));
        });
        
        Logger.log(messages.join("\n\n"));
        GmailApp.sendEmail(address, "[MoE] " + this.instance + "の通知情報", messages.join("\n\n"));
      }
    },

    toot: {
      value: function (content, visibility) {
        var CW = content.match(Mstdn.PARSER.CW) || [];
        
        content = content.replace(CW[0], "");
        
        this.post("api/v1/statuses", {
          status: [
            content,
            "",
            "from #MoE",
            "#MastodonOnEmail"
          ].join("\r\n"),
          
          spoiler_text: CW[1],
          visibility: visibility
        });
      }
    }
  });

  Object.defineProperties(Mstdn, {
    PARSER: {
      get: function () {
        return {
          SUBJECT: /MoE(:[^@<>]+(?=@))?@([^<>]*)(?:<(.)>)?/,
          CW: /\[CW ?\| ?(.*)\]\r?\n/
        }
      }
    },

    VISIBILITY: {
      get: function () {
        return ["public", "unlisted", "private", "direct"]
      }
    },



    parseHtml: {
      value: function (htmlStr) {
        return htmlStr.replace(/(<\/p>)/g, "$1\n\n").replace(/<br ?\/?>/g, "\n").replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "").slice(0, -2);
      }
    }
  });

  return Mstdn;
})();