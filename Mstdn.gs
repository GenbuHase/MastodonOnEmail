var Mstdn = (function () {
  function Mstdn (instance) {
    this.instance = instance,
    this.token = UserProperties.getProperty(instance);
  };

  Mstdn.prototype = Object.create(null, {
    constructor: { value: Mstdn },

    get: {
      value: function (apiUrl, params) {
        var paramStrs = [];

        var option = {
          method: "GET",
          
          headers: {
            "Authorization": "Bearer " + this.token
          }
        }

        if (params) {
          for (var param in params) {
            paramStrs.push(params[param][0] + "=" + params[param][1]);
          }
        }
        
        return UrlFetchApp.fetch("https://" + this.instance + "/" + apiUrl + "?" + paramStrs.join("&"), option);
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
        return JSON.parse(this.get("api/v1/notifications", [
          ["exclude_types[]", "favourite"],
          ["exclude_types[]", "reblog"],
          ["exclude_types[]", "follow"],
        ]).getContentText());
      }
    },

    sendNotificationInfo: {
      value: function (address) {
        var messages = [];
        var notifications = this.getNotifications();
        
        notifications.forEach(function (mention) {
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
        var harukins = content.match(new RegExp(Mstdn.PARSER.HARUKIN.toString().slice(1, -1), "g")) || [];
        
        content = content.replace(CW[0], "");

        for (var i = 0; i < harukins.length; i++) {
          var harukin = harukins[i].match(Mstdn.PARSER.HARUKIN);
          content = content.replace(harukin[0], ":harukin: ".repeat(parseInt(harukin[1])));
        }
        
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
          CW: /\[CW ?\| ?(.*)\]\r?\n/,

          HARUKIN: /\[harukin ?\| ?([^\]]*)\]/
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